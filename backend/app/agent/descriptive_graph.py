from typing import Literal, TypedDict

from langgraph.graph import END, StateGraph

from app.agent.llm import get_llm
from app.agent.prompts import DESCRIPTIVE_GENERATION_SYSTEM_PROMPT
from app.agent.schemas import DescriptiveQuestion, DescriptiveQuestionSet, ResumeExtraction


class DescriptiveState(TypedDict):
    resume: ResumeExtraction
    num_questions: int
    question_set: DescriptiveQuestionSet | None
    attempts: int


def generate_descriptive(state: DescriptiveState) -> DescriptiveState:
    llm = get_llm(temperature=0.5).with_structured_output(DescriptiveQuestionSet)
    prompt = DESCRIPTIVE_GENERATION_SYSTEM_PROMPT.format(num_questions=state["num_questions"])
    question_set = llm.invoke([
        ("system", prompt),
        ("human", state["resume"].model_dump_json()),
    ])
    return {**state, "question_set": question_set, "attempts": state["attempts"] + 1}


def route_after_validate(state: DescriptiveState) -> Literal["retry", "done"]:
    question_set = state["question_set"]
    valid = bool(
        question_set
        and len(question_set.questions) == state["num_questions"]
        and all(q.model_answer and q.key_points for q in question_set.questions)
        and (
            len({q.project_name for q in question_set.questions}) > 1
            or len(state["resume"].projects) == 1
        )
    )
    if valid or state["attempts"] >= 2:
        return "done"
    return "retry"


graph = StateGraph(DescriptiveState)
graph.add_node("generate_descriptive", generate_descriptive)
graph.add_node("validate_descriptive", lambda s: s)
graph.set_entry_point("generate_descriptive")
graph.add_edge("generate_descriptive", "validate_descriptive")
graph.add_conditional_edges(
    "validate_descriptive",
    route_after_validate,
    {"retry": "generate_descriptive", "done": END},
)
compiled_descriptive_graph = graph.compile()


async def run_descriptive_generation(
    resume: ResumeExtraction, num_questions: int = 8
) -> list[DescriptiveQuestion] | None:
    result = await compiled_descriptive_graph.ainvoke(
        {"resume": resume, "num_questions": num_questions, "question_set": None, "attempts": 0}
    )
    question_set = result["question_set"]
    if not question_set or not question_set.questions:
        return None
    return question_set.questions
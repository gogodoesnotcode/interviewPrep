
from typing import TypedDict, Literal
from langgraph.graph import StateGraph, END
from app.agent.llm import get_llm
from app.agent.prompts import MCQ_GENERATION_SYSTEM_PROMPT
from app.agent.schemas import ResumeExtraction, MCQQuizSet

class MCQState(TypedDict):
    resume: ResumeExtraction
    num_questions: int
    quiz: MCQQuizSet | None
    attempts: int

def generate_mcq(state: MCQState) -> MCQState:
    llm = get_llm(temperature=0.5).with_structured_output(MCQQuizSet)
    prompt = MCQ_GENERATION_SYSTEM_PROMPT.format(num_questions=state["num_questions"])
    quiz = llm.invoke([
        ("system", prompt),
        ("human", state["resume"].model_dump_json()),
    ])
    return {**state, "quiz": quiz, "attempts": state["attempts"] + 1}

def route_after_validate(state: MCQState) -> Literal["retry", "done"]:
    quiz = state["quiz"]
    valid = bool(
        quiz
        and len(quiz.questions) == state["num_questions"]
        and all(len(q.options) == 4 and 0 <= q.correct_option_index <= 3 for q in quiz.questions)
        and len({q.project_name for q in quiz.questions}) > 1
    )
    if valid or state["attempts"] >= 2:
        return "done"
    return "retry"

graph = StateGraph(MCQState)
graph.add_node("generate_mcq", generate_mcq)
graph.add_node("validate_mcq", lambda s: s)
graph.set_entry_point("generate_mcq")
graph.add_edge("generate_mcq", "validate_mcq")
graph.add_conditional_edges("validate_mcq", route_after_validate,
                             {"retry": "generate_mcq", "done": END})
compiled_mcq_graph = graph.compile()

async def run_mcq_generation(resume: ResumeExtraction, num_questions: int = 12) -> MCQQuizSet | None:
    result = await compiled_mcq_graph.ainvoke(
        {"resume": resume, "num_questions": num_questions, "quiz": None, "attempts": 0}
    )
    return result["quiz"]
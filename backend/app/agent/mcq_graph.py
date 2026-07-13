
from typing import Literal, TypedDict

from langgraph.graph import END, StateGraph

from app.agent.llm import get_llm
from app.agent.prompts import MCQ_GENERATION_SYSTEM_PROMPT
from app.agent.schemas import MCQQuizSet, ResumeExtraction

class MCQState(TypedDict):
    resume: ResumeExtraction
    num_questions: int
    quiz: MCQQuizSet | None
    attempts: int


def format_resume_for_mcq_prompt(resume: ResumeExtraction) -> str:
    lines = []
    if resume.candidate_name:
        lines.append(f"Candidate: {resume.candidate_name}")

    for project in resume.projects:
        technologies = ", ".join(project.technologies)
        lines.append(
            f"Project: {project.project_name}\n"
            f"Role: {project.role or 'not stated'}\n"
            f"Description: {project.description}\n"
            f"Technologies: {technologies}"
        )

    return "\n\n".join(lines)

def generate_mcq(state: MCQState) -> MCQState:
    llm = get_llm(temperature=0.2).with_structured_output(MCQQuizSet, method="json_schema")
    prompt = MCQ_GENERATION_SYSTEM_PROMPT.format(num_questions=state["num_questions"])
    quiz = llm.invoke([
        ("system", prompt),
        ("human", format_resume_for_mcq_prompt(state["resume"])),
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
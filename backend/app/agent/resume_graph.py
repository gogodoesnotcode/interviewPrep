from typing import Literal, TypedDict

from langgraph.graph import END, StateGraph

from app.agent.llm import get_llm
from app.agent.prompts import RESUME_PARSE_SYSTEM_PROMPT
from app.agent.schemas import ResumeExtraction


class ResumeParseState(TypedDict):
    resume_text: str
    extraction: ResumeExtraction | None
    attempts: int


def parse_resume(state: ResumeParseState) -> ResumeParseState:
    llm = get_llm(temperature=0.2).with_structured_output(ResumeExtraction)
    extraction = llm.invoke([
        ("system", RESUME_PARSE_SYSTEM_PROMPT),
        ("human", state["resume_text"]),
    ])
    return {**state, "extraction": extraction, "attempts": state["attempts"] + 1}


def validate_extraction(state: ResumeParseState) -> ResumeParseState:
    return state


def route_after_validate(state: ResumeParseState) -> Literal["retry", "done"]:
    extraction = state["extraction"]
    valid = bool(extraction and extraction.projects and all(p.technologies for p in extraction.projects))
    if valid or state["attempts"] >= 2:
        return "done"
    return "retry"


graph = StateGraph(ResumeParseState)
graph.add_node("parse_resume", parse_resume)
graph.add_node("validate_extraction", validate_extraction)
graph.set_entry_point("parse_resume")
graph.add_edge("parse_resume", "validate_extraction")
graph.add_conditional_edges("validate_extraction", route_after_validate, {"retry": "parse_resume", "done": END})
compiled_resume_graph = graph.compile()


async def run_resume_parse(resume_text: str) -> ResumeExtraction | None:
    result = await compiled_resume_graph.ainvoke({"resume_text": resume_text, "extraction": None, "attempts": 0})
    extraction = result["extraction"]
    if not extraction or not extraction.projects:
        return None
    return extraction
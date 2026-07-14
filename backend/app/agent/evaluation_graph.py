from app.agent.llm import get_llm
from app.agent.prompts import EVALUATION_SYSTEM_PROMPT
from app.agent.schemas import AnswerEvaluation, DescriptiveQuestion


async def run_evaluation(question: DescriptiveQuestion, user_answer: str) -> AnswerEvaluation:
    llm = get_llm(temperature=0.2).with_structured_output(AnswerEvaluation)
    payload = (
        f"Question: {question.question}\n"
        f"Model answer: {question.model_answer}\n"
        f"Key points: {question.key_points}\n"
        f"Candidate's answer: {user_answer}"
    )
    return llm.invoke([("system", EVALUATION_SYSTEM_PROMPT), ("human", payload)])
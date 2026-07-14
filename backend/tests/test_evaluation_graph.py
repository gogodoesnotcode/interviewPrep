from unittest.mock import MagicMock, patch

import pytest

from app.agent.evaluation_graph import run_evaluation
from app.agent.schemas import AnswerEvaluation, DescriptiveQuestion


@pytest.mark.asyncio
async def test_run_evaluation_success():
    question = DescriptiveQuestion(
        id="dq-1",
        project_name="Chat App",
        technology="FastAPI",
        question="How did you use FastAPI?",
        model_answer="Use FastAPI for the API layer.",
        key_points=["API layer", "validation"],
    )
    fake = AnswerEvaluation(
        question_id="dq-1",
        score=90,
        covered_points=["API layer"],
        missed_points=["validation"],
        feedback="Good answer with room to add validation details.",
    )

    with patch("app.agent.evaluation_graph.get_llm") as mock_get_llm:
        mock_llm = MagicMock()
        mock_llm.with_structured_output.return_value.invoke.return_value = fake
        mock_get_llm.return_value = mock_llm

        result = await run_evaluation(question, "I used FastAPI to build the API.")

    assert result.score == 90
    assert result.question_id == "dq-1"
    assert result.covered_points == ["API layer"]
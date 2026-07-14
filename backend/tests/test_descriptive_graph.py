from unittest.mock import MagicMock, patch

import pytest

from app.agent.descriptive_graph import run_descriptive_generation
from app.agent.schemas import DescriptiveQuestion, DescriptiveQuestionSet, ProjectTech, ResumeExtraction


def _make_question(index: int, project_name: str, technology: str) -> DescriptiveQuestion:
    return DescriptiveQuestion(
        id=f"dq-{index}",
        project_name=project_name,
        technology=technology,
        question=f"How did you use {technology} in {project_name}?",
        model_answer=f"Model answer for {technology}.",
        key_points=["point one", "point two"],
    )


@pytest.mark.asyncio
async def test_run_descriptive_generation_success():
    resume = ResumeExtraction(
        candidate_name="Jane Doe",
        projects=[
            ProjectTech(project_name="Chat App", description="A chat app.", technologies=["FastAPI", "React"]),
            ProjectTech(project_name="Data Pipeline", description="A pipeline.", technologies=["Python", "PostgreSQL"]),
        ],
        all_technologies=["FastAPI", "React", "Python", "PostgreSQL"],
    )

    questions = [
        _make_question(i, "Chat App" if i < 4 else "Data Pipeline", "FastAPI" if i % 2 == 0 else "React")
        for i in range(8)
    ]
    fake = DescriptiveQuestionSet(questions=questions)

    with patch("app.agent.descriptive_graph.get_llm") as mock_get_llm:
        mock_llm = MagicMock()
        mock_llm.with_structured_output.return_value.invoke.return_value = fake
        mock_get_llm.return_value = mock_llm

        result = await run_descriptive_generation(resume, num_questions=8)

    assert result is not None
    assert len(result) == 8
    assert {question.project_name for question in result} == {"Chat App", "Data Pipeline"}
    assert all(question.model_answer for question in result)
    assert all(question.key_points for question in result)
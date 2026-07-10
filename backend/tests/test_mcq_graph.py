from unittest.mock import MagicMock, patch

import pytest

from app.agent.mcq_graph import run_mcq_generation
from app.agent.schemas import MCQQuestion, MCQQuizSet, ProjectTech, ResumeExtraction


def _make_question(index: int, project_name: str, technology: str, difficulty: str) -> MCQQuestion:
    return MCQQuestion(
        id=f"q-{index}",
        project_name=project_name,
        technology=technology,
        difficulty=difficulty,
        question=f"What does {technology} help with in {project_name}?",
        options=["Option A", "Option B", "Option C", "Option D"],
        correct_option_index=1,
        explanation=f"{technology} is used here for the right reason.",
    )


@pytest.mark.asyncio
async def test_run_mcq_generation_success():
    resume = ResumeExtraction(
        candidate_name="Jane Doe",
        projects=[
            ProjectTech(project_name="Chat App", description="A chat app.", technologies=["FastAPI", "React"]),
            ProjectTech(project_name="Data Pipeline", description="A pipeline.", technologies=["Python", "PostgreSQL"]),
        ],
        all_technologies=["FastAPI", "React", "Python", "PostgreSQL"],
    )

    questions = [
        _make_question(i, "Chat App" if i < 6 else "Data Pipeline", "FastAPI" if i % 2 == 0 else "React", "basic")
        for i in range(12)
    ]
    fake = MCQQuizSet(questions=questions)

    with patch("app.agent.mcq_graph.get_llm") as mock_get_llm:
        mock_llm = MagicMock()
        mock_llm.with_structured_output.return_value.invoke.return_value = fake
        mock_get_llm.return_value = mock_llm

        result = await run_mcq_generation(resume, num_questions=12)

    assert result is not None
    assert len(result.questions) == 12
    assert {question.project_name for question in result.questions} == {"Chat App", "Data Pipeline"}
    assert all(len(question.options) == 4 for question in result.questions)
    assert all(0 <= question.correct_option_index <= 3 for question in result.questions)
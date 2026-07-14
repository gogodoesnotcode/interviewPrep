from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from app.main import app
from app.agent.schemas import AnswerEvaluation, DescriptiveQuestion, ProjectTech, ResumeExtraction


client = TestClient(app)


def _resume_payload() -> dict:
    return ResumeExtraction(
        candidate_name="Jane Doe",
        projects=[
            ProjectTech(project_name="Chat App", description="A chat app.", technologies=["FastAPI", "React"]),
        ],
        all_technologies=["FastAPI", "React"],
    ).model_dump()


def _question_payload() -> dict:
    return DescriptiveQuestion(
        id="dq-1",
        project_name="Chat App",
        technology="FastAPI",
        question="How did you use FastAPI?",
        model_answer="Use FastAPI for the API layer.",
        key_points=["API layer", "validation"],
    ).model_dump()


def test_generate_descriptive_route_success():
    with patch("app.api.routes.run_descriptive_generation", new=AsyncMock(return_value=[_question_payload()])):
        response = client.post("/api/quiz/descriptive", json={"resume": _resume_payload(), "num_questions": 8})

    assert response.status_code == 200
    assert len(response.json()["questions"]) == 1


def test_evaluate_route_success():
    fake = AnswerEvaluation(
        question_id="dq-1",
        score=85,
        covered_points=["API layer"],
        missed_points=["validation"],
        feedback="Solid answer.",
    )

    with patch("app.api.routes.run_evaluation", new=AsyncMock(return_value=fake)):
        response = client.post(
            "/api/quiz/evaluate",
            json={"question": _question_payload(), "user_answer": "I used FastAPI for the API."},
        )

    assert response.status_code == 200
    assert response.json()["score"] == 85
from unittest.mock import MagicMock, patch

import pytest

from app.agent.resume_graph import run_resume_parse
from app.agent.schemas import ProjectTech, ResumeExtraction


@pytest.mark.asyncio
async def test_run_resume_parse_success():
    fake = ResumeExtraction(
        candidate_name="Jane Doe",
        projects=[ProjectTech(project_name="Chat App", description="A chat app.", technologies=["FastAPI", "React"])],
        all_technologies=["FastAPI", "React"],
    )
    with patch("app.agent.resume_graph.get_llm") as mock_get_llm:
        mock_llm = MagicMock()
        mock_llm.with_structured_output.return_value.invoke.return_value = fake
        mock_get_llm.return_value = mock_llm

        result = await run_resume_parse("some resume text")
        assert result.candidate_name == "Jane Doe"
        assert len(result.projects) == 1
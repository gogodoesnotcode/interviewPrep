from typing import Literal

from pydantic import BaseModel, Field


class ProjectTech(BaseModel):
    project_name: str
    role: str | None = None
    description: str = Field(description="1-2 sentence summary, grounded in the resume's own wording")
    technologies: list[str] = Field(description="Every technology explicitly mentioned for this project")


class ResumeExtraction(BaseModel):
    candidate_name: str | None = None
    projects: list[ProjectTech]
    all_technologies: list[str] = Field(description="Deduplicated flat list across all projects")
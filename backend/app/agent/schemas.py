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


class MCQQuestion(BaseModel):
    id: str
    project_name: str
    technology: str
    difficulty: Literal["basic", "intermediate", "advanced"]
    question: str
    options: list[str] = Field(min_length=4, max_length=4)
    correct_option_index: int = Field(ge=0, le=3)
    explanation: str

class MCQQuizSet(BaseModel):
    questions: list[MCQQuestion]


class DescriptiveQuestion(BaseModel):
    id: str
    project_name: str
    technology: str
    question: str
    model_answer: str = Field(description="Reference answer — sent to the client but not rendered pre-grading")
    key_points: list[str] = Field(description="3-5 ideas a strong answer should cover")


class DescriptiveQuestionSet(BaseModel):
    questions: list[DescriptiveQuestion]


class AnswerEvaluation(BaseModel):
    question_id: str
    score: int = Field(ge=0, le=100)
    covered_points: list[str]
    missed_points: list[str]
    feedback: str
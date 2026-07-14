from pydantic import BaseModel
from pydantic import Field
from app.agent.schemas import DescriptiveQuestion, ResumeExtraction


class ResumeUploadResponse(BaseModel):
    resume: ResumeExtraction


class MCQGenerationRequest(BaseModel):
    resume: ResumeExtraction
    num_questions: int = Field(default=12, ge=10, le=15)


class DescriptiveGenerationRequest(BaseModel):
    resume: ResumeExtraction
    num_questions: int = Field(default=8, ge=5, le=10)


class EvaluationRequest(BaseModel):
    question: DescriptiveQuestion
    user_answer: str
    
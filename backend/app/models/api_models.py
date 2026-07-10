from pydantic import BaseModel
from pydantic import Field
from app.agent.schemas import ResumeExtraction


class ResumeUploadResponse(BaseModel):
    resume: ResumeExtraction


class MCQGenerationRequest(BaseModel):
    resume: ResumeExtraction
    num_questions: int = Field(default=12, ge=10, le=15)
    
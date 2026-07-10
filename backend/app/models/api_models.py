from pydantic import BaseModel

from app.agent.schemas import ResumeExtraction


class ResumeUploadResponse(BaseModel):
    resume: ResumeExtraction
from fastapi import APIRouter, UploadFile, HTTPException
from app.core.config import settings
from app.agent.resume_graph import run_resume_parse
from app.parsing.resume_extractor import extract_text
from app.models.api_models import ResumeUploadResponse

router = APIRouter(prefix="/api")

@router.post("/resumes/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile):
    if file.content_type != "application/pdf":
        raise HTTPException(400, "Only PDF files are supported.")
    raw_bytes = await file.read()
    if len(raw_bytes) > settings.MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(400, f"File too large (max {settings.MAX_UPLOAD_MB}MB).")

    text = extract_text(raw_bytes)
    if len(text.strip()) < 50:
        raise HTTPException(422, "Couldn't read enough text from this PDF.")

    resume = await run_resume_parse(text)
    if resume is None:
        raise HTTPException(422, "Couldn't extract any projects from this resume.")
    return ResumeUploadResponse(resume=resume)

@router.get("/health")
async def health():
    return {"status": "ok"}

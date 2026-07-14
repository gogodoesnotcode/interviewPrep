from fastapi import APIRouter, UploadFile, HTTPException
from app.core.config import settings
from app.agent.descriptive_graph import run_descriptive_generation
from app.agent.evaluation_graph import run_evaluation
from app.agent.resume_graph import run_resume_parse
from app.agent.mcq_graph import run_mcq_generation
from app.parsing.resume_extractor import extract_text
from app.models.api_models import (
    DescriptiveGenerationRequest,
    EvaluationRequest,
    MCQGenerationRequest,
    ResumeUploadResponse,
)

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


@router.post("/quiz/mcq")
async def generate_mcq(req: MCQGenerationRequest):
    quiz = await run_mcq_generation(req.resume, req.num_questions)
    if quiz is None:
        raise HTTPException(422, "Question generation failed validation twice — try again.")
    return quiz


@router.post("/quiz/descriptive")
async def generate_descriptive(req: DescriptiveGenerationRequest):
    questions = await run_descriptive_generation(req.resume, req.num_questions)
    if questions is None:
        raise HTTPException(422, "Question generation failed validation twice — try again.")
    return {"questions": questions}


@router.post("/quiz/evaluate")
async def evaluate(req: EvaluationRequest):
    return await run_evaluation(req.question, req.user_answer)

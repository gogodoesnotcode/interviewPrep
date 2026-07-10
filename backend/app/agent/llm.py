from langchain_groq import ChatGroq

from app.core.config import settings


def get_llm(temperature: float = 0.3):
    return ChatGroq(
        model=settings.MODEL_NAME,
        temperature=temperature,
        api_key=settings.GROQ_API_KEY,
    )
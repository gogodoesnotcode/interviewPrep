from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GROQ_API_KEY: str = ""
    MODEL_NAME: str = "openai/gpt-oss-120b"
    ENV: str = "dev"
    MAX_UPLOAD_MB: int = 5

    class Config:
        env_file = ".env"

settings = Settings()

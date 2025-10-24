from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/home_db"
    
    # JWT settings
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost",
        "http://localhost:80",
        "http://127.0.0.1",
        "http://127.0.0.1:3000"
    ]
    
    class Config:
        env_file = ".env"

settings = Settings()

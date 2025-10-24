from pydantic_settings import BaseSettings
from typing import List, Optional
import os

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
        "http://127.0.0.1:3000",
        "https://yadash.ru",
        "http://yadash.ru"
    ]
    
    # Environment
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # В продакшене добавляем дополнительные origins
        if self.ENVIRONMENT == "production":
            production_origins = [
                "https://yadash.ru",
                "http://yadash.ru",
                "https://www.yadash.ru",
                "http://www.yadash.ru"
            ]
            # Добавляем production origins, если их еще нет
            for origin in production_origins:
                if origin not in self.ALLOWED_ORIGINS:
                    self.ALLOWED_ORIGINS.append(origin)

settings = Settings()

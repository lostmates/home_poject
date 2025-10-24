from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routers import auth, tasks
from config import settings

app = FastAPI(title="Home Project API", version="1.0.0")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])

@app.get("/")
async def root():
    return {"message": "Home Project API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

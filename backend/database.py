from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from config import settings

# Создание асинхронного движка базы данных
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,
    future=True
)

# Создание фабрики сессий
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Зависимость для получения сессии базы данных
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

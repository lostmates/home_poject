#!/usr/bin/env python3
"""
Скрипт для тестирования подключения к базе данных
"""
import asyncio
import asyncpg
import os

async def test_connection():
    """Тестирует подключение к PostgreSQL"""
    try:
        # Параметры подключения
        host = os.getenv('DB_HOST', 'db')
        port = os.getenv('DB_PORT', '5432')
        user = os.getenv('DB_USER', 'postgres')
        password = os.getenv('DB_PASSWORD', 'root')
        database = os.getenv('DB_NAME', 'home_db')
        
        print(f"Попытка подключения к {user}@{host}:{port}/{database}")
        
        # Подключение к базе данных
        conn = await asyncpg.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database
        )
        
        print("✅ Подключение к базе данных успешно!")
        
        # Проверка версии PostgreSQL
        version = await conn.fetchval('SELECT version()')
        print(f"Версия PostgreSQL: {version}")
        
        # Закрытие соединения
        await conn.close()
        print("✅ Соединение закрыто")
        
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())

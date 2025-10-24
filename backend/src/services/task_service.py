from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, desc
from sqlalchemy.orm import selectinload
from typing import List, Optional, Tuple
from datetime import date, datetime, timedelta
from src.models.models import Task, User
from src.schemas.task import TaskCreate, TaskUpdate

async def create_task(db: AsyncSession, task: TaskCreate, user_id: int) -> Task:
    """Создание новой задачи"""
    db_task = Task(
        title=task.title,
        description=task.description,
        start_date=task.start_date,
        end_date=task.end_date,
        start_time=task.start_time,
        end_time=task.end_time,
        category=task.category,
        user_id=user_id
    )
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

async def get_task(db: AsyncSession, task_id: int, user_id: int) -> Optional[Task]:
    """Получение задачи по ID (только для владельца)"""
    result = await db.execute(
        select(Task).where(
            and_(Task.id == task_id, Task.user_id == user_id)
        )
    )
    return result.scalar_one_or_none()

async def get_tasks(
    db: AsyncSession, 
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    period: Optional[str] = None,
    category: Optional[str] = None,
    completed: Optional[bool] = None
) -> Tuple[List[Task], int]:
    """Получение списка задач с фильтрацией и пагинацией"""
    
    # Базовый запрос
    query = select(Task).where(Task.user_id == user_id)
    count_query = select(func.count(Task.id)).where(Task.user_id == user_id)
    
    # Фильтрация по периоду
    if period:
        today = date.today()
        
        if period == "day":
            query = query.where(Task.start_date == today)
            count_query = count_query.where(Task.start_date == today)
            
        elif period == "week":
            # Неделя начинается с понедельника
            week_start = today - timedelta(days=today.weekday())
            week_end = week_start + timedelta(days=6)
            query = query.where(
                and_(
                    Task.start_date >= week_start,
                    Task.start_date <= week_end
                )
            )
            count_query = count_query.where(
                and_(
                    Task.start_date >= week_start,
                    Task.start_date <= week_end
                )
            )
            
        elif period == "month":
            query = query.where(
                and_(
                    func.extract('year', Task.start_date) == today.year,
                    func.extract('month', Task.start_date) == today.month
                )
            )
            count_query = count_query.where(
                and_(
                    func.extract('year', Task.start_date) == today.year,
                    func.extract('month', Task.start_date) == today.month
                )
            )
    
    # Фильтрация по категории
    if category:
        query = query.where(Task.category == category)
        count_query = count_query.where(Task.category == category)
    
    # Фильтрация по статусу выполнения
    if completed is not None:
        query = query.where(Task.completed == completed)
        count_query = count_query.where(Task.completed == completed)
    
    # Сортировка: сначала незавершенные, потом завершенные, затем по дате
    query = query.order_by(
        Task.completed.asc(),
        Task.start_date.asc().nullslast(),
        Task.created_at.desc()
    )
    
    # Пагинация
    query = query.offset(skip).limit(limit)
    
    # Выполнение запросов
    result = await db.execute(query)
    tasks = result.scalars().all()
    
    count_result = await db.execute(count_query)
    total = count_result.scalar()
    
    return tasks, total

async def update_task(db: AsyncSession, task_id: int, task_update: TaskUpdate, user_id: int) -> Optional[Task]:
    """Обновление задачи"""
    db_task = await get_task(db, task_id, user_id)
    if not db_task:
        return None
    
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    await db.commit()
    await db.refresh(db_task)
    return db_task

async def delete_task(db: AsyncSession, task_id: int, user_id: int) -> bool:
    """Удаление задачи"""
    db_task = await get_task(db, task_id, user_id)
    if not db_task:
        return False
    
    await db.delete(db_task)
    await db.commit()
    return True

async def toggle_task_completion(db: AsyncSession, task_id: int, user_id: int) -> Optional[Task]:
    """Переключение статуса выполнения задачи"""
    db_task = await get_task(db, task_id, user_id)
    if not db_task:
        return None
    
    db_task.completed = not db_task.completed
    await db.commit()
    await db.refresh(db_task)
    return db_task

async def get_task_stats(db: AsyncSession, user_id: int, period: Optional[str] = None) -> dict:
    """Получение статистики по задачам"""
    today = date.today()
    
    # Базовый запрос
    base_query = select(Task).where(Task.user_id == user_id)
    
    # Фильтрация по периоду
    if period:
        if period == "day":
            base_query = base_query.where(Task.start_date == today)
        elif period == "week":
            week_start = today - timedelta(days=today.weekday())
            week_end = week_start + timedelta(days=6)
            base_query = base_query.where(
                and_(
                    Task.start_date >= week_start,
                    Task.start_date <= week_end
                )
            )
        elif period == "month":
            base_query = base_query.where(
                and_(
                    func.extract('year', Task.start_date) == today.year,
                    func.extract('month', Task.start_date) == today.month
                )
            )
    
    # Общее количество
    total_result = await db.execute(
        select(func.count(Task.id)).select_from(base_query.subquery())
    )
    total = total_result.scalar()
    
    # Завершенные
    completed_result = await db.execute(
        select(func.count(Task.id)).select_from(
            base_query.where(Task.completed == True).subquery()
        )
    )
    completed = completed_result.scalar()
    
    # Активные
    pending = total - completed
    
    # Просроченные (дата окончания в прошлом и не завершены)
    overdue_result = await db.execute(
        select(func.count(Task.id)).select_from(
            base_query.where(
                and_(
                    Task.end_date < today,
                    Task.completed == False
                )
            ).subquery()
        )
    )
    overdue = overdue_result.scalar()
    
    # На сегодня
    today_result = await db.execute(
        select(func.count(Task.id)).select_from(
            base_query.where(
                or_(
                    Task.start_date == today,
                    Task.end_date == today
                )
            ).subquery()
        )
    )
    today_count = today_result.scalar()
    
    return {
        "total": total,
        "completed": completed,
        "pending": pending,
        "overdue": overdue,
        "today": today_count
    }

async def search_tasks(
    db: AsyncSession, 
    user_id: int, 
    search_query: str,
    skip: int = 0,
    limit: int = 100
) -> Tuple[List[Task], int]:
    """Поиск задач по названию и описанию"""
    query = select(Task).where(
        and_(
            Task.user_id == user_id,
            or_(
                Task.title.ilike(f"%{search_query}%"),
                Task.description.ilike(f"%{search_query}%")
            )
        )
    ).order_by(Task.created_at.desc())
    
    count_query = select(func.count(Task.id)).where(
        and_(
            Task.user_id == user_id,
            or_(
                Task.title.ilike(f"%{search_query}%"),
                Task.description.ilike(f"%{search_query}%")
            )
        )
    )
    
    # Пагинация
    query = query.offset(skip).limit(limit)
    
    # Выполнение запросов
    result = await db.execute(query)
    tasks = result.scalars().all()
    
    count_result = await db.execute(count_query)
    total = count_result.scalar()
    
    return tasks, total

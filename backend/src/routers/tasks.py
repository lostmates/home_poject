from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
from database import get_db
from src.models.models import User
from src.schemas.task import (
    TaskCreate, 
    TaskUpdate, 
    TaskResponse, 
    TaskListResponse, 
    TaskStatsResponse
)
from src.services.task_service import (
    create_task,
    get_task,
    get_tasks,
    update_task,
    delete_task,
    toggle_task_completion,
    get_task_stats,
    search_tasks
)
from src.routers.auth import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_new_task(
    task: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Создание новой задачи"""
    db_task = await create_task(db, task, current_user.id)
    return db_task

@router.get("/", response_model=TaskListResponse)
async def get_user_tasks(
    skip: int = Query(0, ge=0, description="Количество пропускаемых записей"),
    limit: int = Query(100, ge=1, le=1000, description="Количество записей на странице"),
    period: Optional[str] = Query(None, description="Фильтр по периоду: day, week, month"),
    category: Optional[str] = Query(None, description="Фильтр по категории"),
    completed: Optional[bool] = Query(None, description="Фильтр по статусу выполнения"),
    search: Optional[str] = Query(None, description="Поиск по названию и описанию"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получение списка задач пользователя с фильтрацией и пагинацией"""
    
    # Если есть поисковый запрос, используем поиск
    if search:
        tasks, total = await search_tasks(db, current_user.id, search, skip, limit)
    else:
        tasks, total = await get_tasks(
            db, current_user.id, skip, limit, period, category, completed
        )
    
    total_pages = (total + limit - 1) // limit
    current_page = (skip // limit) + 1
    
    return TaskListResponse(
        tasks=tasks,
        total=total,
        page=current_page,
        per_page=limit,
        total_pages=total_pages
    )

@router.get("/stats", response_model=TaskStatsResponse)
async def get_user_task_stats(
    period: Optional[str] = Query(None, description="Фильтр по периоду: day, week, month"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получение статистики по задачам пользователя"""
    stats = await get_task_stats(db, current_user.id, period)
    return TaskStatsResponse(**stats)

@router.get("/{task_id}", response_model=TaskResponse)
async def get_single_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получение конкретной задачи по ID"""
    task = await get_task(db, task_id, current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Задача не найдена"
        )
    return task

@router.put("/{task_id}", response_model=TaskResponse)
async def update_existing_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Обновление задачи"""
    task = await update_task(db, task_id, task_update, current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Задача не найдена"
        )
    return task

@router.patch("/{task_id}/toggle", response_model=TaskResponse)
async def toggle_task_status(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Переключение статуса выполнения задачи"""
    task = await toggle_task_completion(db, task_id, current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Задача не найдена"
        )
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Удаление задачи"""
    success = await delete_task(db, task_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Задача не найдена"
        )

@router.get("/category/{category}", response_model=TaskListResponse)
async def get_tasks_by_category(
    category: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получение задач по категории"""
    tasks, total = await get_tasks(
        db, current_user.id, skip, limit, category=category
    )
    
    total_pages = (total + limit - 1) // limit
    current_page = (skip // limit) + 1
    
    return TaskListResponse(
        tasks=tasks,
        total=total,
        page=current_page,
        per_page=limit,
        total_pages=total_pages
    )

@router.get("/period/{period}", response_model=TaskListResponse)
async def get_tasks_by_period(
    period: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получение задач по периоду"""
    if period not in ["day", "week", "month"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Период должен быть: day, week или month"
        )
    
    tasks, total = await get_tasks(
        db, current_user.id, skip, limit, period=period
    )
    
    total_pages = (total + limit - 1) // limit
    current_page = (skip // limit) + 1
    
    return TaskListResponse(
        tasks=tasks,
        total=total,
        page=current_page,
        per_page=limit,
        total_pages=total_pages
    )

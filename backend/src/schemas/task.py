from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime, date, time

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    category: Optional[str] = None

class TaskCreate(TaskBase):
    @validator('title')
    def validate_title(cls, v):
        if not v or not v.strip():
            raise ValueError('Название задачи не может быть пустым')
        if len(v.strip()) > 200:
            raise ValueError('Название задачи не может быть длиннее 200 символов')
        return v.strip()
    
    @validator('description')
    def validate_description(cls, v):
        if v and len(v) > 1000:
            raise ValueError('Описание не может быть длиннее 1000 символов')
        return v
    
    @validator('end_date')
    def validate_end_date(cls, v, values):
        if v and 'start_date' in values and values['start_date']:
            if v < values['start_date']:
                raise ValueError('Дата окончания не может быть раньше даты начала')
        return v
    
    @validator('end_time')
    def validate_end_time(cls, v, values):
        if v and 'start_time' in values and values['start_time']:
            if 'start_date' in values and 'end_date' in values:
                # Если даты одинаковые, проверяем время
                if (values.get('start_date') == values.get('end_date') and 
                    values.get('start_date') is not None):
                    if v <= values['start_time']:
                        raise ValueError('Время окончания должно быть позже времени начала')
        return v
    
    @validator('category')
    def validate_category(cls, v):
        if v:
            valid_categories = ['work', 'personal', 'health', 'education', 'hobby', 'other']
            if v not in valid_categories:
                raise ValueError(f'Категория должна быть одной из: {", ".join(valid_categories)}')
        return v

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    category: Optional[str] = None
    completed: Optional[bool] = None
    
    @validator('title')
    def validate_title(cls, v):
        if v is not None:
            if not v or not v.strip():
                raise ValueError('Название задачи не может быть пустым')
            if len(v.strip()) > 200:
                raise ValueError('Название задачи не может быть длиннее 200 символов')
            return v.strip()
        return v
    
    @validator('description')
    def validate_description(cls, v):
        if v is not None and len(v) > 1000:
            raise ValueError('Описание не может быть длиннее 1000 символов')
        return v
    
    @validator('category')
    def validate_category(cls, v):
        if v is not None:
            valid_categories = ['work', 'personal', 'health', 'education', 'hobby', 'other']
            if v not in valid_categories:
                raise ValueError(f'Категория должна быть одной из: {", ".join(valid_categories)}')
        return v

class TaskResponse(TaskBase):
    id: int
    completed: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    user_id: int
    
    class Config:
        from_attributes = True

class TaskListResponse(BaseModel):
    tasks: list[TaskResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

class TaskStatsResponse(BaseModel):
    total: int
    completed: int
    pending: int
    overdue: int
    today: int

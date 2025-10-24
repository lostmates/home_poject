from sqlalchemy import Column, Integer, String, DateTime, Boolean, Date, Time, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связь с задачами
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=True, index=True)
    end_date = Column(Date, nullable=True, index=True)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    category = Column(String, nullable=True, index=True)
    completed = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign key к пользователю
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Связь с пользователем
    owner = relationship("User", back_populates="tasks")

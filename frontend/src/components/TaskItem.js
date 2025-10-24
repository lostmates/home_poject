import React, { useState } from 'react';

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const getCategoryLabel = (category) => {
    const categories = {
      work: 'Работа',
      personal: 'Личное',
      health: 'Здоровье',
      education: 'Обучение',
      hobby: 'Хобби',
      other: 'Другое'
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      work: '#3498db',
      personal: '#e74c3c',
      health: '#2ecc71',
      education: '#f39c12',
      hobby: '#9b59b6',
      other: '#95a5a6'
    };
    return colors[category] || '#95a5a6';
  };

  const isOverdue = () => {
    if (!task.end_date) return false;
    const endDate = new Date(task.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate < today && !task.completed;
  };

  const isToday = () => {
    if (!task.start_date && !task.end_date) return false;
    const today = new Date();
    const startDate = task.start_date ? new Date(task.start_date) : null;
    const endDate = task.end_date ? new Date(task.end_date) : null;
    
    const todayStr = today.toISOString().split('T')[0];
    return (startDate && startDate.toISOString().split('T')[0] === todayStr) ||
           (endDate && endDate.toISOString().split('T')[0] === todayStr);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''} ${isToday() ? 'today' : ''}`}>
      <div className="task-item-header">
        <div className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="task-checkbox-input"
          />
        </div>
        
        <div className="task-main-info" onClick={() => setIsExpanded(!isExpanded)}>
          <h4 className="task-title">{task.title}</h4>
          <div className="task-meta">
            {task.category && (
              <span 
                className="task-category"
                style={{ backgroundColor: getCategoryColor(task.category) }}
              >
                {getCategoryLabel(task.category)}
              </span>
            )}
            {task.start_date && (
              <span className="task-date">
                {formatDate(task.start_date)}
                {task.start_time && ` в ${formatTime(task.start_time)}`}
              </span>
            )}
            {isOverdue() && (
              <span className="task-overdue">Просрочено</span>
            )}
            {isToday() && !isOverdue() && (
              <span className="task-today">Сегодня</span>
            )}
          </div>
        </div>
        
        <div className="task-actions">
          <button
            type="button"
            className="task-action-button edit"
            onClick={() => onEdit(task)}
            title="Редактировать"
          >
            ✏️
          </button>
          <button
            type="button"
            className="task-action-button delete"
            onClick={() => onDelete(task.id)}
            title="Удалить"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="task-item-details">
          {task.description && (
            <div className="task-description">
              <strong>Описание:</strong>
              <p>{task.description}</p>
            </div>
          )}
          
          <div className="task-dates">
            {task.start_date && (
              <div className="task-date-info">
                <strong>Начало:</strong> {formatDate(task.start_date)}
                {task.start_time && ` в ${formatTime(task.start_time)}`}
              </div>
            )}
            {task.end_date && (
              <div className="task-date-info">
                <strong>Окончание:</strong> {formatDate(task.end_date)}
                {task.end_time && ` в ${formatTime(task.end_time)}`}
              </div>
            )}
          </div>
          
          <div className="task-created">
            <small>Создано: {formatDate(task.created_at)}</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;

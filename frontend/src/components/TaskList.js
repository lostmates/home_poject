import React, { useState, useMemo } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = ({ 
  tasks, 
  selectedPeriod, 
  onToggleComplete, 
  onDeleteTask, 
  onUpdateTask, 
  loading = false,
  onRefresh 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Теперь фильтрация происходит на сервере, поэтому просто используем полученные задачи
  const filteredTasks = useMemo(() => {
    return tasks || [];
  }, [tasks]);

  // Сортировка задач: сначала незавершенные, потом завершенные
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      // Сначала незавершенные задачи
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Затем по дате начала (если есть)
      if (a.startDate && b.startDate) {
        return new Date(a.startDate) - new Date(b.startDate);
      }
      
      // Затем по дате создания
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }, [filteredTasks]);

  const handleAddTask = (newTask) => {
    onUpdateTask(newTask);
    setShowAddForm(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = (updatedTask) => {
    onUpdateTask(updatedTask);
    setEditingTask(null);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const getPeriodLabel = () => {
    const labels = {
      day: 'сегодня',
      week: 'эту неделю',
      month: 'этот месяц'
    };
    return labels[selectedPeriod] || 'выбранный период';
  };

  const getTaskStats = () => {
    const total = sortedTasks.length;
    const completed = sortedTasks.filter(task => task.completed).length;
    const pending = total - completed;
    const overdue = sortedTasks.filter(task => {
      if (!task.endDate || task.completed) return false;
      const endDate = new Date(task.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return endDate < today;
    }).length;

    return { total, completed, pending, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="task-list">
      <div className="task-list-header">
        <div className="task-list-title">
          <h3>Задачи на {getPeriodLabel()}</h3>
          <div className="task-stats">
            <span className="stat-item total">Всего: {stats.total}</span>
            <span className="stat-item pending">Активные: {stats.pending}</span>
            <span className="stat-item completed">Завершено: {stats.completed}</span>
            {stats.overdue > 0 && (
              <span className="stat-item overdue">Просрочено: {stats.overdue}</span>
            )}
          </div>
        </div>
        <div className="task-list-actions">
          {onRefresh && (
            <button
              type="button"
              className="refresh-button"
              onClick={onRefresh}
              disabled={loading}
              title="Обновить"
            >
              🔄
            </button>
          )}
          <button
            type="button"
            className="add-task-button"
            onClick={() => setShowAddForm(true)}
            disabled={loading}
          >
            + Добавить задачу
          </button>
        </div>
      </div>

      {showAddForm && (
        <TaskForm
          onAddTask={handleAddTask}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onAddTask={handleUpdateTask}
          onCancel={handleCancelEdit}
        />
      )}

      <div className="task-list-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Загрузка задач...</p>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="no-tasks">
            <p>Нет задач на {getPeriodLabel()}</p>
            <button
              type="button"
              className="add-first-task-button"
              onClick={() => setShowAddForm(true)}
            >
              Создать первую задачу
            </button>
          </div>
        ) : (
          <div className="tasks-container">
            {sortedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onDelete={onDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;

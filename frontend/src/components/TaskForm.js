import React, { useState } from 'react';

const TaskForm = ({ task, onAddTask, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    startDate: task?.start_date || '',
    endDate: task?.end_date || '',
    startTime: task?.start_time || '',
    endTime: task?.end_time || '',
    category: task?.category || ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название задачи обязательно';
    }
    
    // Проверяем, что дата окончания не раньше даты начала
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'Дата окончания не может быть раньше даты начала';
      }
    }
    
    // Проверяем, что время окончания не раньше времени начала (если даты одинаковые)
    if (formData.startDate && formData.endDate && 
        formData.startDate === formData.endDate && 
        formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        newErrors.endTime = 'Время окончания должно быть позже времени начала';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Подготавливаем данные для API
      const taskData = {
        title: formData.title,
        description: formData.description || null,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        start_time: formData.startTime || null,
        end_time: formData.endTime || null,
        category: formData.category || null
      };

      // Если это редактирование, добавляем ID
      if (task?.id) {
        taskData.id = task.id;
      }
      
      onAddTask(taskData);
      
      // Сбрасываем форму только если это новая задача
      if (!task) {
        setFormData({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: '',
          category: ''
        });
      }
    }
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <div className="task-form-header">
          <h3>{task ? 'Редактировать задачу' : 'Создать новую задачу'}</h3>
          <button 
            type="button" 
            className="close-button"
            onClick={onCancel}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="task-form-content">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Название задачи *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Введите название задачи"
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Описание задачи (необязательно)"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                Дата начала
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate" className="form-label">
                Дата окончания
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`form-input ${errors.endDate ? 'error' : ''}`}
              />
              {errors.endDate && <div className="error-message">{errors.endDate}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime" className="form-label">
                Время начала
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime" className="form-label">
                Время окончания
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className={`form-input ${errors.endTime ? 'error' : ''}`}
              />
              {errors.endTime && <div className="error-message">{errors.endTime}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Раздел
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Выберите раздел</option>
              <option value="work">Работа</option>
              <option value="personal">Личное</option>
              <option value="health">Здоровье</option>
              <option value="education">Обучение</option>
              <option value="hobby">Хобби</option>
              <option value="other">Другое</option>
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="form-button secondary"
              onClick={onCancel}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="form-button primary"
            >
              {task ? 'Сохранить изменения' : 'Создать задачу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

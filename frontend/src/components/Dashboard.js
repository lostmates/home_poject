import React, { useState, useEffect } from 'react';
import Header from './Header';
import PeriodSelector from './PeriodSelector';
import TaskList from './TaskList';
import ConfirmationModal from './ConfirmationModal';
import taskApi from '../services/taskApi';

const Dashboard = ({ user, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Загружаем задачи при инициализации и изменении периода
  useEffect(() => {
    loadTasks();
  }, [selectedPeriod]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskApi.getTasks({ period: selectedPeriod });
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Ошибка при загрузке задач:', error);
      setError('Не удалось загрузить задачи. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskApi.toggleTaskCompletion(taskId);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Ошибка при изменении статуса задачи:', error);
      setError('Не удалось изменить статус задачи');
    }
  };

  const handleDeleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const taskTitle = task ? task.title : 'эту задачу';
    
    setConfirmationModal({
      isOpen: true,
      title: 'Удаление задачи',
      message: `Вы уверены, что хотите удалить задачу "${taskTitle}"? Это действие нельзя отменить.`,
      onConfirm: async () => {
        try {
          await taskApi.deleteTask(taskId);
          setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        } catch (error) {
          console.error('Ошибка при удалении задачи:', error);
          setError('Не удалось удалить задачу');
        }
      }
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null
    });
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      if (updatedTask.id && tasks.find(task => task.id === updatedTask.id)) {
        // Обновляем существующую задачу
        const response = await taskApi.updateTask(updatedTask.id, updatedTask);
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === updatedTask.id ? response : task
          )
        );
      } else {
        // Добавляем новую задачу
        const response = await taskApi.createTask(updatedTask);
        setTasks(prevTasks => [...prevTasks, response]);
      }
    } catch (error) {
      console.error('Ошибка при сохранении задачи:', error);
      setError('Не удалось сохранить задачу');
    }
  };

  return (
    <div className="dashboard">
      <Header user={user} onLogout={onLogout} />
      
      <div className="dashboard-content">
        <div className="dashboard-main">
          
          <div className="period-section">
            <h2>Выберите период</h2>
            <PeriodSelector 
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
            />
          </div>

          {error && (
            <div className="error-banner">
              <p>{error}</p>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          <div className="content-area">
            <TaskList
              tasks={tasks}
              selectedPeriod={selectedPeriod}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
              loading={loading}
              onRefresh={loadTasks}
            />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText="Удалить"
        cancelText="Отмена"
        type="danger"
      />
    </div>
  );
};

export default Dashboard;

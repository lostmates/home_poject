// Автоматическое определение URL API в зависимости от окружения
const getApiBaseUrl = () => {
  // Если задана переменная окружения, используем её
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Автоматическое определение по текущему домену
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  } else if (hostname === 'yadash.ru') {
    return 'http://yadash.ru:8000/api';
  }
  
  // Fallback для других доменов
  return `${window.location.protocol}//${hostname}/api`;
};

const API_BASE_URL = getApiBaseUrl();

class TaskApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Получение токена из localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Создание заголовков с авторизацией
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Обработка ответа от API
  async handleResponse(response) {
    if (!response.ok) {
      // Если получили 401 Unauthorized, очищаем localStorage и перенаправляем на авторизацию
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Перезагружаем страницу для показа формы авторизации
        window.location.reload();
        return;
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Создание новой задачи
  async createTask(taskData) {
    try {
      const response = await fetch(`${this.baseURL}/tasks/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(taskData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // Получение списка задач
  async getTasks(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Добавляем параметры фильтрации
      if (params.period) queryParams.append('period', params.period);
      if (params.category) queryParams.append('category', params.category);
      if (params.completed !== undefined) queryParams.append('completed', params.completed);
      if (params.search) queryParams.append('search', params.search);
      if (params.skip) queryParams.append('skip', params.skip);
      if (params.limit) queryParams.append('limit', params.limit);

      const url = `${this.baseURL}/tasks/?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  // Получение конкретной задачи
  async getTask(taskId) {
    try {
      const response = await fetch(`${this.baseURL}/tasks/${taskId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  // Обновление задачи
  async updateTask(taskId, updateData) {
    try {
      const response = await fetch(`${this.baseURL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Переключение статуса выполнения задачи
  async toggleTaskCompletion(taskId) {
    try {
      const response = await fetch(`${this.baseURL}/tasks/${taskId}/toggle`, {
        method: 'PATCH',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }

  // Удаление задачи
  async deleteTask(taskId) {
    try {
      const response = await fetch(`${this.baseURL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return true; // Успешное удаление
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Получение статистики по задачам
  async getTaskStats(period = null) {
    try {
      const queryParams = period ? `?period=${period}` : '';
      const response = await fetch(`${this.baseURL}/tasks/stats${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching task stats:', error);
      throw error;
    }
  }

  // Получение задач по категории
  async getTasksByCategory(category, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.skip) queryParams.append('skip', params.skip);
      if (params.limit) queryParams.append('limit', params.limit);

      const url = `${this.baseURL}/tasks/category/${category}?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching tasks by category:', error);
      throw error;
    }
  }

  // Получение задач по периоду
  async getTasksByPeriod(period, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.skip) queryParams.append('skip', params.skip);
      if (params.limit) queryParams.append('limit', params.limit);

      const url = `${this.baseURL}/tasks/period/${period}?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching tasks by period:', error);
      throw error;
    }
  }

  // Поиск задач
  async searchTasks(searchQuery, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('search', searchQuery);
      if (params.skip) queryParams.append('skip', params.skip);
      if (params.limit) queryParams.append('limit', params.limit);

      const url = `${this.baseURL}/tasks/?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw error;
    }
  }
}

// Создаем экземпляр сервиса
const taskApi = new TaskApiService();

export default taskApi;

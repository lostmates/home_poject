import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onSwitchToRegister, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', formData);
      console.log('Login successful:', response.data);
      
      // Получаем данные пользователя
      const userResponse = await axios.get('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${response.data.access_token}`
        }
      });
      
      // Передаем данные пользователя и токен в родительский компонент
      onLogin(userResponse.data, response.data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при входе в систему');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="auth-title">Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Пароль
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="form-button"
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <div className="auth-switch">
        <span>Нет аккаунта? </span>
        <button type="button" onClick={onSwitchToRegister}>
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
};

export default LoginForm;

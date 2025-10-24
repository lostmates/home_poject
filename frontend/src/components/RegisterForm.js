import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = ({ onSwitchToLogin, onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    again_password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Проверка совпадения паролей
    if (formData.password !== formData.again_password) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        again_password: formData.again_password
      });
      
      setSuccess('Регистрация прошла успешно! Теперь вы можете войти в систему.');
      console.log('Registration successful:', response.data);
      
      // Передаем данные пользователя в родительский компонент
      onRegister(response.data, null);
      
      // Очистка формы
      setFormData({
        name: '',
        email: '',
        password: '',
        again_password: ''
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="auth-title">Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Имя
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

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

        <div className="form-group">
          <label className="form-label" htmlFor="again_password">
            Повторите пароль
          </label>
          <input
            type="password"
            id="again_password"
            name="again_password"
            className="form-input"
            value={formData.again_password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button
          type="submit"
          className="form-button"
          disabled={loading}
        >
          {loading ? 'Регистрация...' : 'Отправить'}
        </button>
      </form>

      <div className="auth-switch">
        <span>Уже есть аккаунт? </span>
        <button type="button" onClick={onSwitchToLogin}>
          Войти
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;

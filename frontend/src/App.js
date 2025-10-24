import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Проверяем, есть ли сохраненный токен при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const switchForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = (userData, token) => {
    // Сохраняем данные пользователя и токен
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Очищаем сохраненные данные
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setUser(null);
    setIsAuthenticated(false);
  };

  // Если пользователь авторизован, показываем Dashboard
  if (isAuthenticated && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Иначе показываем формы авторизации
  return (
    <div className="container">
      <div className="auth-container">
        {isLogin ? (
          <LoginForm 
            onSwitchToRegister={switchForm}
            onLogin={handleLogin}
          />
        ) : (
          <RegisterForm 
            onSwitchToLogin={switchForm}
            onRegister={handleLogin}
          />
        )}
      </div>
    </div>
  );
}

export default App;

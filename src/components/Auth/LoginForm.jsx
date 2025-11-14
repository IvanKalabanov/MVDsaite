// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { register as registerUser } from '../../utils/api';
import './LoginForm.css';

const LoginForm = () => {
  const { setUser, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    confirmPassword: ''
  });

  // Тестовые аккаунты для быстрого входа
  const testAccounts = [
    { name: 'Администратор', login: 'admin', password: 'admin123', role: 'admin' },
    { name: 'Руководитель ОУР', login: 'leader', password: 'leader123', role: 'leader' },
    { name: 'Сотрудник ППСП', login: 'employee', password: 'employee123', role: 'employee' },
    { name: 'Гражданин', login: 'user', password: 'user123', role: 'user' }
  ];

  const handleQuickLogin = async (account) => {
    try {
      await login(account.login, account.password);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Неизвестная ошибка';
      alert(`Ошибка входа: ${errorMessage}\n\nВсе данные теперь хранятся в локальном хранилище браузера.`);
      console.error('Ошибка быстрого входа:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    try {
      if (isLogin) {
        // Вход через API
        await login(formData.login, formData.password);
      } else {
        // Регистрация через API
        const data = await registerUser(formData.name || formData.login, formData.login, formData.password);
        setUser(data.user);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Ошибка при входе/регистрации');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>МВД Enter Project</h1>
          <p>Система управления правоохранительной организацией</p>
        </div>

        <div className="login-card">
          <h2>{isLogin ? 'Вход в систему' : 'Регистрация'}</h2>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Логин</label>
              <input
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Пароль</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Подтверждение пароля</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-large">
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="login-switch">
            <button 
              className="link-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>

          <div className="quick-login">
            <h3>Быстрый вход (тестовые аккаунты):</h3>
            <div className="quick-accounts">
              {testAccounts.map(account => (
                <button
                  key={account.login}
                  className="quick-account-btn"
                  onClick={() => handleQuickLogin(account)}
                >
                  <span className="account-role">{account.role}</span>
                  <span className="account-name">{account.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
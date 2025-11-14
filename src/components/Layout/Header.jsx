// src/components/Layout/Header.jsx (обновляем)
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  const getRoleLabel = (role) => {
    const roles = {
      'user': 'Гражданин',
      'employee': 'Сотрудник',
      'leader': 'Руководитель',
      'admin': 'Администратор'
    };
    return roles[role] || role;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <div className="logo-icon">⚡</div>
          <div className="logo-text">
            <h1>МВД Enter Project</h1>
            <p>Игровая правоохранительная организация</p>
          </div>
        </div>
        
        <div className="user-section">
          <div className="user-info">
            <div className="user-avatar">
              {user.name.charAt(0)}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{getRoleLabel(user.role)}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
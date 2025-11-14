import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useAuth();

  // Данные сотрудника (если пользователь является сотрудником)
  const employeeData = {
    name: user.name,
    rank: user.role === 'employee' ? 'Сержант' : 
          user.role === 'leader' ? 'Майор' : 
          user.role === 'admin' ? 'Полковник' : 'Не указано',
    position: user.role === 'employee' ? 'Сотрудник ППСП' : 
              user.role === 'leader' ? 'Руководитель отдела' : 
              user.role === 'admin' ? 'Администратор системы' : 'Гражданин',
    department: user.role === 'employee' ? 'ППСП' : 
                user.role === 'leader' ? 'ОУР' : 
                user.role === 'admin' ? 'Штаб' : 'Не указано',
    phone: user.role !== 'user' ? `internal-${user.login}` : 'Не указано',
    badgeNumber: user.role !== 'user' ? `МВД-${user.id}` : 'Не указано',
    startDate: user.role !== 'user' ? '2024-01-01' : 'Не указано',
    status: 'Активный'
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h1>Личный кабинет</h1>
        <p>Основная информация и данные</p>
      </div>

      <div className="profile-content">
        {/* Основная информация пользователя */}
        <div className="profile-section">
          <h2>Основная информация</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>ФИО:</label>
              <span>{user.name}</span>
            </div>
            <div className="info-item">
              <label>Логин:</label>
              <span>{user.login}</span>
            </div>
            <div className="info-item">
              <label>Роль:</label>
              <span className={`role-badge role-${user.role}`}>
                {user.role === 'user' && 'Гражданин'}
                {user.role === 'employee' && 'Сотрудник'}
                {user.role === 'leader' && 'Руководитель'}
                {user.role === 'admin' && 'Администратор'}
              </span>
            </div>
            <div className="info-item">
              <label>ID пользователя:</label>
              <span>{user.id}</span>
            </div>
          </div>
        </div>

        {/* Информация сотрудника (если не гражданин) */}
        {user.role !== 'user' && (
          <div className="profile-section">
            <h2>Служебная информация</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Звание:</label>
                <span>{employeeData.rank}</span>
              </div>
              <div className="info-item">
                <label>Должность:</label>
                <span>{employeeData.position}</span>
              </div>
              <div className="info-item">
                <label>Подразделение:</label>
                <span>{employeeData.department}</span>
              </div>
              <div className="info-item">
                <label>Личный номер:</label>
                <span className="badge-number">{employeeData.badgeNumber}</span>
              </div>
              <div className="info-item">
                <label>Внутренний телефон:</label>
                <span>{employeeData.phone}</span>
              </div>
              <div className="info-item">
                <label>Дата назначения:</label>
                <span>{employeeData.startDate}</span>
              </div>
              <div className="info-item">
                <label>Статус:</label>
                <span className={`status-indicator status-${employeeData.status.toLowerCase()}`}>
                  {employeeData.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Статистика и активность */}
        <div className="profile-section">
          <h2>Статистика активности</h2>
          <div className="stats-cards">
            <div className="stat-card profile-stat">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <div className="stat-value">5</div>
                <div className="stat-label">Подано заявлений</div>
              </div>
            </div>
            <div className="stat-card profile-stat">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <div className="stat-value">3</div>
                <div className="stat-label">Принято</div>
              </div>
            </div>
            <div className="stat-card profile-stat">
              <div className="stat-icon">🕒</div>
              <div className="stat-info">
                <div className="stat-value">2</div>
                <div className="stat-label">В обработке</div>
              </div>
            </div>
            {user.role !== 'user' && (
              <div className="stat-card profile-stat">
                <div className="stat-icon">👮</div>
                <div className="stat-info">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Обработано дел</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
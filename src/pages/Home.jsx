// src/pages/Home.jsx (обновляем)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStats } from '../utils/api';
import './Home.css';

const Home = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState([
    { label: 'Сотрудников в штате', value: '0', color: 'blue' },
    { label: 'Заявлений за месяц', value: '0', color: 'green' },
    { label: 'Дела в работе', value: '0', color: 'orange' },
    { label: 'Нарушителей в базе', value: '0', color: 'red' }
  ]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getStats();
      setStats([
        { label: 'Сотрудников в штате', value: String(data.employees || 0), color: 'blue' },
        { label: 'Заявлений за месяц', value: String(data.applications || 0), color: 'green' },
        { label: 'Дела в работе', value: String(data.inProgress || 0), color: 'orange' },
        { label: 'Нарушителей в базе', value: String(data.database || 0), color: 'red' }
      ]);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>Добро пожаловать в МВД Enter Project</h1>
        <p className="welcome-text">
          {user.role === 'user' 
            ? 'Мы обеспечиваем правопорядок и безопасность граждан. Для подачи заявления используйте соответствующую форму.'
            : `Добро пожаловать, ${user.name}. Используйте панель навигации для работы с системой.`
          }
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>Быстрые действия</h2>
        <div className="actions-grid">
          <Link to="/applications" className="action-card"> {/* ← исправляем на Link */}
            <div className="action-icon">📝</div>
            <h3>Подать заявление</h3>
            <p>Заполните форму обращения</p>
          </Link>
          
          <Link to="/news" className="action-card"> {/* ← исправляем на Link */}
            <div className="action-icon">📰</div>
            <h3>Новости</h3>
            <p>Последние обновления</p>
          </Link>

          {hasRole('employee') && (
            <>
              <Link to="/database" className="action-card"> {/* ← исправляем на Link */}
                <div className="action-icon">🗃️</div>
                <h3>База данных</h3>
                <p>Работа с нарушениями</p>
              </Link>
              
              <Link to="/employees" className="action-card"> {/* ← исправляем на Link */}
                <div className="action-icon">👮</div>
                <h3>Сотрудники</h3>
                <p>Штатное расписание</p>
              </Link>
            </>
          )}

          {hasRole('admin') && (
            <Link to="/admin" className="action-card"> {/* ← исправляем на Link */}
              <div className="action-icon">⚙️</div>
              <h3>Администрирование</h3>
              <p>Управление пользователями и ролями</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
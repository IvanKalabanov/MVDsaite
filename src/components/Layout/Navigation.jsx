// src/components/Layout/Navigation.jsx (обновляем)
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const { hasRole } = useAuth();

  const navItems = [
    { path: '/', label: 'Главная' },
    { path: '/profile', label: 'Личный кабинет' }, // ← добавляем
    { path: '/news', label: 'Новости' },
    { path: '/leadership', label: 'Руководство' },
    { path: '/applications', label: 'Подача заявлений' },
  ];

  if (hasRole('employee')) {
    navItems.push({ path: '/database', label: 'База данных' });
    navItems.push({ path: '/employees', label: 'Сотрудники' });
  }

  if (hasRole('admin')) {
    navItems.push({ path: '/admin', label: 'Администрирование' });
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
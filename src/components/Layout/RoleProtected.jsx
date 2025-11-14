// src/components/Layout/RoleProtected.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RoleProtected = ({ children, requiredRole }) => {
  const { hasRole } = useAuth();

  if (!hasRole(requiredRole)) {
    return (
      <div className="access-denied">
        <h2>Доступ запрещен</h2>
        <p>У вас недостаточно прав для просмотра этой страницы</p>
      </div>
    );
  }

  return children;
};

export default RoleProtected;
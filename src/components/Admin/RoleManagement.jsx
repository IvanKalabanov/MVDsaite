// src/components/Admin/RoleManagement.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUsers, updateUserRole, deleteUser, register } from '../../utils/api';
import RoleProtected from '../Layout/RoleProtected';
import './RoleManagement.css';

const initialNewUser = {
  name: '',
  login: '',
  password: '',
  role: 'user',
  department: 'Штаб'
};

const RoleManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [processingUserId, setProcessingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState(initialNewUser);

  const roles = [
    { value: 'user', label: 'Гражданин', description: 'Может подавать заявления и просматривать новости' },
    { value: 'employee', label: 'Сотрудник', description: 'Доступ к базе данных и просмотр сотрудников' },
    { value: 'leader', label: 'Руководитель', description: 'Управление сотрудниками и добавление руководителей' },
    { value: 'admin', label: 'Администратор', description: 'Полный доступ ко всем функциям системы' }
  ];

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      alert('Не удалось загрузить пользователей. Попробуйте обновить страницу.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getRoleBadge = (role) => {
    const roleConfig = {
      user: { class: 'role-user', label: 'Гражданин' },
      employee: { class: 'role-employee', label: 'Сотрудник' },
      leader: { class: 'role-leader', label: 'Руководитель' },
      admin: { class: 'role-admin', label: 'Администратор' }
    };
    
    const config = roleConfig[role] || roleConfig.user;
    return <span className={`role-badge ${config.class}`}>{config.label}</span>;
  };

  const cannotEdit = (targetUser) => {
    if (!targetUser) return true;
    if (targetUser.id === user.id) return true;
    // Нельзя понижать других админов без прямого доступа
    if (targetUser.role === 'admin' && targetUser.id !== user.id) return true;
    return false;
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Удалить пользователя без возможности восстановления?')) return;

    setProcessingUserId(userId);
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Ошибка удаления пользователя:', error);
      alert('Не удалось удалить пользователя.');
    } finally {
      setProcessingUserId(null);
    }
  };

  const updateUser = async (userId, newRole) => {
    setProcessingUserId(userId);
    try {
      const updated = await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      setEditingUser(prev => prev && prev.id === userId ? updated : prev);
    } catch (error) {
      console.error('Ошибка изменения роли:', error);
      alert('Не удалось изменить роль пользователя.');
    } finally {
      setProcessingUserId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return users.filter(item => {
      const matchesSearch = !search || [item.name, item.login, item.department]
        .some(field => (field || '').toLowerCase().includes(search));
      const matchesRole = roleFilter === 'all' || item.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleCreateUser = async (event) => {
    event.preventDefault();
    if (!newUser.name || !newUser.login || !newUser.password) {
      alert('Заполните имя, логин и пароль');
      return;
    }

    setProcessingUserId('create');
    try {
      await register(newUser.name, newUser.login, newUser.password, newUser.role);
      await loadUsers();
      setNewUser(initialNewUser);
      setShowCreateForm(false);
      alert('Пользователь создан');
    } catch (error) {
      console.error('Ошибка создания пользователя:', error);
      alert(error.message || 'Не удалось создать пользователя');
    } finally {
      setProcessingUserId(null);
    }
  };

  return (
    <RoleProtected requiredRole="admin">
      <div className="role-management">
        <div className="page-header">
          <div>
            <h1>Управление ролями пользователей</h1>
            <p>Настройка прав доступа для сотрудников и граждан</p>
          </div>
        </div>

        <div className="roles-info">
          <h3>Уровни доступа:</h3>
          <div className="roles-grid">
            {roles.map(role => (
              <div key={role.value} className="role-info-card">
                <div className="role-header">
                  {getRoleBadge(role.value)}
                </div>
                <p>{role.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="users-table-container">
          <div className="table-header">
            <div>
              <h3>Пользователи системы</h3>
              <p className="table-subtitle">Управляйте аккаунтами, ролями и доступами</p>
            </div>
            <div className="table-stats">
              Всего: {users.length} пользователей
            </div>
          </div>

          <div className="user-tools">
            <div className="user-filters">
              <input
                className="form-input"
                placeholder="Поиск по ФИО, логину или отделу..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Все роли</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
            <div className="user-tool-buttons">
              <button className="btn btn-outline btn-sm" onClick={loadUsers}>
                ⟳ Обновить список
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowCreateForm(prev => !prev)}
              >
                {showCreateForm ? 'Скрыть форму' : '+ Добавить пользователя'}
              </button>
            </div>
          </div>

          {showCreateForm && (
            <form className="create-user-card" onSubmit={handleCreateUser}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ФИО</label>
                  <input
                    className="form-input"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Логин</label>
                  <input
                    className="form-input"
                    value={newUser.login}
                    onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Пароль</label>
                  <input
                    className="form-input"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Роль</label>
                  <select
                    className="form-select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewUser(initialNewUser);
                  }}
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={processingUserId === 'create'}
                >
                  {processingUserId === 'create' ? 'Создание...' : 'Создать пользователя'}
                </button>
              </div>
            </form>
          )}

          <div className="table-container">
            {loading ? (
              <div className="loading">Загрузка пользователей...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="loading">Нет пользователей по заданным критериям</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ФИО</th>
                    <th>Логин</th>
                    <th>Подразделение</th>
                    <th>Текущая роль</th>
                    <th>Последняя активность</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(userItem => (
                  <tr key={userItem.id}>
                    <td className="user-name">
                      <div className="name-avatar">
                        <div className="avatar-circle">
                          {userItem.name?.split(' ').map(n => n[0]).join('')}
                        </div>
                        {userItem.name}
                        {userItem.id === user.id && (
                          <span className="current-user-badge">Вы</span>
                        )}
                      </div>
                    </td>
                    <td>{userItem.login}</td>
                    <td>{userItem.department || '—'}</td>
                    <td>{getRoleBadge(userItem.role)}</td>
                    <td>{userItem.last_active || userItem.lastActive || 'Никогда'}</td>
                    <td>
                      <div className="user-actions">
                        {cannotEdit(userItem) ? (
                          <span className="no-edit">Недоступно</span>
                        ) : (
                          <>
                            <button
                              className="btn btn-small btn-primary"
                              onClick={() => setEditingUser(userItem)}
                            >
                              Изменить роль
                            </button>
                            <button
                              className="btn btn-small btn-danger"
                              onClick={() => handleDeleteUser(userItem.id)}
                              disabled={processingUserId === userItem.id}
                            >
                              {processingUserId === userItem.id ? 'Удаляем...' : 'Удалить'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {editingUser && (
          <div className="modal-overlay" onClick={() => setEditingUser(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setEditingUser(null)}>×</button>
              
              <h2>Изменение роли пользователя</h2>
              
              <div className="user-info">
                <div className="user-avatar-large">
                  {editingUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3>{editingUser.name}</h3>
                  <p>Логин: {editingUser.login}</p>
                  <p>Текущая роль: {getRoleBadge(editingUser.role)}</p>
                </div>
              </div>

              <div className="role-selection">
                <h4>Выберите новую роль:</h4>
                <div className="role-options">
                  {roles.map(role => (
                    <label key={role.value} className="role-option">
                      <input
                        type="radio"
                        name="newRole"
                        value={role.value}
                        checked={editingUser.role === role.value}
                        onChange={() => updateUser(editingUser.id, role.value)}
                      />
                      <div className="role-option-content">
                        <span className="role-option-label">{role.label}</span>
                        <span className="role-option-desc">{role.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setEditingUser(null)}
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleProtected>
  );
};

export default RoleManagement;
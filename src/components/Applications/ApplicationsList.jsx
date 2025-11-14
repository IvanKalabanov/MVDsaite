// src/components/Applications/ApplicationsList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getApplications, updateApplication, addApplicationResponse } from '../../utils/api';
import ApplicationDetails from './ApplicationDetails';
import './ApplicationsList.css';

const ApplicationsList = ({ viewType }) => {
  const { user, hasRole } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, [viewType, user.login]);

  useEffect(() => {
    setStatusFilter('all');
  }, [viewType]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (viewType === 'my') {
        params.author_login = user.login;
      }
      const apps = await getApplications(params);
      setApplications(apps);
    } catch (error) {
      console.error('Ошибка загрузки заявлений:', error);
      alert('Ошибка загрузки заявлений. Проверьте локальное хранилище браузера.');
    } finally {
      setLoading(false);
    }
  };

  const updateApp = async (appId, updates) => {
    try {
      const updated = await updateApplication(appId, updates);
      setApplications(prev => prev.map(app => 
        app.id === appId ? updated : app
      ));
      if (selectedApplication && selectedApplication.id === appId) {
        setSelectedApplication(updated);
      }
    } catch (error) {
      console.error('Ошибка обновления заявления:', error);
      alert('Ошибка обновления заявления');
    }
  };

  const addResponse = async (appId, response) => {
    try {
      await addApplicationResponse(appId, {
        author: response.author,
        text: response.text,
        action: response.action,
        is_official: response.isOfficial ? 1 : 0
      });
      await loadApplications(); // Перезагружаем заявления
      if (selectedApplication && selectedApplication.id === appId) {
        const updated = await getApplications({ id: appId });
        if (updated[0]) setSelectedApplication(updated[0]);
      }
    } catch (error) {
      console.error('Ошибка добавления ответа:', error);
      alert('Ошибка добавления ответа');
    }
  };

  const statusMap = {
    new: 'новое',
    'in-progress': 'в работе',
    accepted: 'принято',
    rejected: 'отклонено',
    closed: 'закрыто'
  };

  const priorityTone = (priority) => {
    const normalized = (priority || '').toLowerCase();
    if (normalized.includes('низ')) return 'low';
    if (normalized.includes('сред')) return 'medium';
    if (normalized.includes('крит')) return 'critical';
    return 'high';
  };

  const filteredApplications = useMemo(() => {
    if (statusFilter === 'all') return applications;
    const targetStatus = statusMap[statusFilter];
    return applications.filter(app => app.status === targetStatus);
  }, [applications, statusFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'новое': { class: 'status-new', label: 'Новое' },
      'в работе': { class: 'status-in-progress', label: 'В работе' },
      'принято': { class: 'status-accepted', label: 'Принято' },
      'отклонено': { class: 'status-rejected', label: 'Отклонено' },
      'закрыто': { class: 'status-closed', label: 'Закрыто' }
    };
    const config = statusConfig[status] || statusConfig['новое'];
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'низкий': { class: 'priority-low', label: 'Низкий' },
      'средний': { class: 'priority-medium', label: 'Средний' },
      'высокий': { class: 'priority-high', label: 'Высокий' },
      'критический': { class: 'priority-critical', label: 'Критический' }
    };
    const config = priorityConfig[priority] || priorityConfig['средний'];
    return <span className={`priority-badge ${config.class}`}>{config.label}</span>;
  };

  const showStatusFilter = viewType === 'all' || viewType === 'my';

  return (
    <div className="applications-list">
      <div className="list-header">
        <h3>
          {viewType === 'my' ? 'Мои заявления' : 'Все заявления'} 
          <span className="count-badge">{filteredApplications.length}</span>
        </h3>
        {showStatusFilter && (
          <div className="filters">
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="new">Новые</option>
              <option value="in-progress">В работе</option>
              <option value="accepted">Принятые</option>
              <option value="rejected">Отклоненные</option>
              <option value="closed">Закрытые</option>
            </select>
          </div>
        )}
      </div>

      <div className="applications-table">
        {loading ? (
          <div className="loading">Загрузка заявлений...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="no-applications">
            <p>Заявления не найдены по текущим фильтрам</p>
            {statusFilter !== 'all' && (
              <button className="btn btn-outline btn-sm" onClick={() => setStatusFilter('all')}>
                Сбросить фильтр
              </button>
            )}
          </div>
        ) : (
          filteredApplications.map(app => (
          <div 
            key={app.id} 
            className="application-row"
            data-priority={priorityTone(app.priority)}
          >
            <div className="app-main-info">
              <div className="app-type-icon">
                {app.type.includes('преступлении') ? '🚨' : 
                 app.type.includes('нарушении') ? '⚠️' :
                 app.type.includes('руководству') ? '📝' : '🎯'}
              </div>
              <div className="app-details">
                <div className="app-title-section">
                  <h4 className="app-title">{app.title}</h4>
                  {getPriorityBadge(app.priority)}
                  {getStatusBadge(app.status)}
                </div>
                <div className="app-meta">
                  <span className="app-type">{app.type}</span>
                  <span className="app-author">от {app.author}</span>
                {app.author_login && app.author_login !== user.login && (
                  <span className="app-author-login">({app.author_login})</span>
                )}
                  <span className="app-date">{app.created_at || app.createdAt}</span>
                  {app.assigned_to && (
                    <span className="app-assigned">Назначено: {app.assigned_to}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="app-actions">
              <button 
                className="btn btn-small btn-primary"
                onClick={() => setSelectedApplication(app)}
              >
                Просмотр
              </button>
              
              {(hasRole('leader') || hasRole('admin')) && app.status === 'новое' && (
                <button 
                  className="btn btn-small btn-secondary"
                  onClick={() => updateApp(app.id, { status: 'в работе' })}
                >
                  В работу
                </button>
              )}
            </div>
          </div>
          ))
        )}
      </div>

      {selectedApplication && (
        <ApplicationDetails 
          application={selectedApplication}
          onClose={() => {
            setSelectedApplication(null);
            loadApplications(); // Перезагружаем после закрытия
          }}
          onUpdate={updateApp}
          onRespond={addResponse}
          canManage={hasRole('leader') || hasRole('admin')}
        />
      )}
    </div>
  );
};

export default ApplicationsList;
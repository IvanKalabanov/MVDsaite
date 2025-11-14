// src/components/Applications/ApplicationForm.jsx (обновляем)
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ApplicationModal from './ApplicationModal';
import ApplicationsList from './ApplicationsList';
import { createApplication } from '../../utils/api';
import './ApplicationForm.css';

const ApplicationForm = () => {
  const { user, hasRole } = useAuth();
  const [selectedForm, setSelectedForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('new'); // 'new' или 'my'

  const applicationTypes = [
    {
      id: 'crime',
      title: 'Заявление о преступлении',
      icon: '🚨',
      description: 'Сообщение о совершенном или готовящемся преступлении',
      color: 'red'
    },
    {
      id: 'violation',
      title: 'Сообщение о нарушении',
      icon: '⚠️',
      description: 'Информация о административных правонарушениях',
      color: 'orange'
    },
    {
      id: 'appeal',
      title: 'Обращение к руководству',
      icon: '📝',
      description: 'Вопросы и предложения руководству организации',
      color: 'blue'
    },
    {
      id: 'complaint',
      title: 'Жалоба',
      icon: '🎯',
      description: 'Жалоба на действия сотрудников или решения органов',
      color: 'purple'
    }
  ];

  const handleFormSelect = (formType) => {
    setSelectedForm(formType);
    setShowModal(true);
  };

  return (
    <div className="applications-page">
      <div className="page-header">
        <div>
          <h1>Подача заявлений</h1>
          <p>Система обработки обращений граждан</p>
        </div>
      </div>

      {/* Навигация между созданием и просмотром заявлений */}
      <div className="applications-tabs">
        <button 
          className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          📝 Новое заявление
        </button>
        <button 
          className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          📋 Мои заявления
        </button>
        {hasRole('employee') && (
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            🗂️ Все заявления
          </button>
        )}
      </div>

      {activeTab === 'new' && (
        <div className="applications-grid">
          {applicationTypes.map(form => (
            <div 
              key={form.id}
              className={`application-card application-${form.color}`}
              onClick={() => handleFormSelect(form)}
            >
              <div className="application-icon">{form.icon}</div>
              <h3>{form.title}</h3>
              <p>{form.description}</p>
              <div className="application-arrow">→</div>
            </div>
          ))}
        </div>
      )}

      {(activeTab === 'my' || activeTab === 'all') && (
        <ApplicationsList 
          viewType={activeTab}
        />
      )}

      {showModal && selectedForm && (
        <ApplicationModal 
          formType={selectedForm}
          onClose={() => {
            setShowModal(false);
            setSelectedForm(null);
          }}
          onSubmit={async (data) => {
            try {
              await createApplication({
                type: data.type,
                title: data.title || `${data.type} от ${user.name}`,
                author: user.name,
                author_login: user.login,
                description: data.description || JSON.stringify(data),
                priority: data.priority || 'средний',
                department: data.department || 'Штаб'
              });
              alert('Заявление успешно подано!');
              setShowModal(false);
              setSelectedForm(null);
              setActiveTab('my'); // Переключаем на просмотр заявлений
            } catch (error) {
              console.error('Ошибка подачи заявления:', error);
              alert('Ошибка подачи заявления. Попробуйте ещё раз — данные сохраняются локально.');
            }
          }}
        />
      )}
    </div>
  );
};

export default ApplicationForm;
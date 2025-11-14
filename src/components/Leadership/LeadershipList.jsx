// src/components/Leadership/LeadershipList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getLeaders, createLeader, deleteLeader } from '../../utils/api';
import { DEPARTMENT_CONFIG } from '../../utils/constants';
import LeaderCard from './LeaderCard';
import AddLeaderForm from './AddLeaderForm';
import './LeadershipList.css';

const LeadershipList = () => {
  const { hasRole } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadLeaders();
  }, []);

  const loadLeaders = async () => {
    try {
      setLoading(true);
      const data = await getLeaders();
      setLeaders(data);
      setErrorMessage('');
    } catch (error) {
      console.error('Ошибка загрузки руководителей:', error);
      setErrorMessage('Не удалось загрузить актуальный список. Отображаются локальные данные.');
      alert('Ошибка загрузки руководителей. Данные берутся локально.');
    } finally {
      setLoading(false);
    }
  };

  const addLeader = async (newLeader) => {
    try {
      const created = await createLeader(newLeader);
      setLeaders(prev => [...prev, created]);
      setShowAddForm(false);
      alert('Руководитель успешно добавлен!');
    } catch (error) {
      console.error('Ошибка добавления руководителя:', error);
      alert('Ошибка добавления руководителя');
    }
  };

  const handleDeleteLeader = async (leaderId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого руководителя?')) return;
    
    try {
      await deleteLeader(leaderId);
      setLeaders(prev => prev.filter(l => l.id !== leaderId));
      alert('Руководитель успешно удален!');
    } catch (error) {
      console.error('Ошибка удаления руководителя:', error);
      alert('Ошибка удаления руководителя');
    }
  };

  const departmentsRepresented = new Set(leaders.map(leader => leader.department)).size;
  const heroStats = [
    { label: 'Руководителей', value: leaders.length || 0 },
    { label: 'Подразделений в кадре', value: departmentsRepresented },
    { label: 'Готовность к работе', value: '100%' }
  ];

  return (
    <div className="leadership-list">
      <section className="leadership-hero">
        <div>
          <p className="hero-eyebrow">Руководство МВД</p>
          <h1>Открытая витрина руководителей и ключевых направлений</h1>
          <p className="hero-subtitle">
            Обновлённый раздел с карточками руководителей, фото и контактами. 
            Видно, кто отвечает за ключевые направления — от штаба до УСБ.
          </p>
        </div>

        <div className="hero-actions">
          {(hasRole('leader') || hasRole('admin')) && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              + Добавить руководителя
            </button>
          )}
          <div className="hero-stats">
            {heroStats.map(stat => (
              <div key={stat.label} className="hero-stat">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {errorMessage && (
        <div className="leadership-alert">
          {errorMessage}
        </div>
      )}

      {showAddForm && (
        <AddLeaderForm 
          onAdd={addLeader}
          onCancel={() => setShowAddForm(false)}
          departments={DEPARTMENT_CONFIG}
        />
      )}

      {loading ? (
        <div className="loading">Загрузка руководителей...</div>
      ) : leaders.length === 0 ? (
        <div className="no-leaders">
          <div className="no-leaders-icon">👔</div>
          <h3>Руководителей пока нет</h3>
          <p>Добавьте первого руководителя</p>
        </div>
      ) : (
        <>
          <div className="leaders-grid">
            {leaders.map(leader => (
              <LeaderCard 
                key={leader.id} 
                leader={leader}
                onDelete={hasRole('admin') ? () => handleDeleteLeader(leader.id) : null}
                canDelete={hasRole('admin')}
              />
            ))}
          </div>

          {/* Табличная сводка руководства */}
          <section className="leaders-table-section">
            <div className="page-header" style={{ marginTop: '40px' }}>
              <div>
                <h2>Таблица руководства</h2>
                <p>Сводный список с ФИО, должностями, подразделениями и контактами</p>
              </div>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ФИО</th>
                    <th>Должность</th>
                    <th>Подразделение</th>
                    <th>Контакты</th>
                  </tr>
                </thead>
                <tbody>
                  {leaders.map(leader => {
                    const dept = DEPARTMENT_CONFIG.find(d => d.code === leader.department || d.name === leader.department);
                    return (
                      <tr 
                        key={leader.id}
                        className={`leaders-table-row ${dept ? `leaders-dept-${dept.id}` : ''}`}
                      >
                        <td>{leader.full_name || leader.name}</td>
                        <td>{leader.position}</td>
                        <td>
                          <span className="leaders-dept-cell">
                            {dept && (
                              <span className="dept-icon" aria-hidden="true">{dept.icon}</span>
                            )}
                            <span>{leader.department}</span>
                          </span>
                        </td>
                        <td>{leader.contacts || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <div className="leadership-departments">
        {DEPARTMENT_CONFIG.map(dept => (
          <div key={dept.id} className="leadership-dept-card">
            <span className="dept-icon" aria-hidden="true">{dept.icon}</span>
            <div>
              <p className="dept-name">{dept.name}</p>
              <p className="dept-description">{dept.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadershipList;
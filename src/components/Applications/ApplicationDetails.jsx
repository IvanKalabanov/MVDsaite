// src/components/Applications/ApplicationDetails.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ApplicationDetails.css';

const ApplicationDetails = ({ application, onClose, onUpdate, onRespond, canManage }) => {
  const { user } = useAuth();
  const [responseText, setResponseText] = useState('');
  const [actionType, setActionType] = useState('response');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Шаблоны сообщений для разных типов ответов
  const responseTemplates = {
    response: '',
    accept: 'Ваше заявление принято к рассмотрению. Мы свяжемся с вами в ближайшее время.',
    reject: 'К сожалению, ваше заявление отклонено по следующим причинам:\n\n',
    close: 'Заявление закрыто. Все вопросы решены.'
  };

  // Автоматическое заполнение сообщения при выборе типа ответа
  const handleActionTypeChange = (newActionType) => {
    setActionType(newActionType);
    if (newActionType !== 'response' && responseTemplates[newActionType]) {
      setResponseText(responseTemplates[newActionType]);
    } else if (newActionType === 'response') {
      setResponseText('');
    }
  };

  const handleRespond = async () => {
    if (!responseText.trim()) {
      alert('Пожалуйста, заполните сообщение перед отправкой');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = {
        id: Date.now(),
        author: user.name,
        text: responseText,
        createdAt: new Date().toLocaleString('ru-RU'),
        isOfficial: canManage,
        is_official: canManage ? 1 : 0,
        action: actionType !== 'response' ? actionType : null
      };

      await onRespond(application.id, response);
      
      // Применяем статус и закрываем заявление при определенных действиях
      if (actionType !== 'response') {
        let newStatus = application.status;
        switch (actionType) {
          case 'accept':
            newStatus = 'принято';
            break;
          case 'reject':
            newStatus = 'отклонено';
            break;
          case 'close':
            newStatus = 'закрыто';
            break;
        }
        await onUpdate(application.id, { status: newStatus });
        
        // Закрываем модальное окно после отправки ответа с действием
        setTimeout(() => {
          onClose();
        }, 500);
      }

      setResponseText('');
      setActionType('response');
    } catch (error) {
      console.error('Ошибка отправки ответа:', error);
      alert('Ошибка отправки ответа');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePin = () => {
    onUpdate(application.id, { 
      isPinned: !application.isPinned 
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="application-details">
          <div className="app-detail-header">
            <div className="app-detail-title">
              <h2>{application.title}</h2>
              <div className="app-detail-badges">
                <span className={`priority-badge priority-${application.priority}`}>
                  {application.priority}
                </span>
                <span className={`status-badge status-${application.status}`}>
                  {application.status}
                </span>
                {application.isPinned && <span className="pinned-badge">📌 Закреплено</span>}
              </div>
            </div>
            
            {canManage && (
              <div className="app-management-actions">
                <button 
                  className={`btn btn-small ${application.isPinned ? 'btn-secondary' : 'btn-outline'}`}
                  onClick={handlePin}
                >
                  {application.isPinned ? 'Открепить' : 'Закрепить'}
                </button>
              </div>
            )}
          </div>

          <div className="app-detail-meta">
            <div className="meta-item">
              <strong>Тип:</strong> {application.type}
            </div>
            <div className="meta-item">
              <strong>Автор:</strong> {application.author}
            </div>
            <div className="meta-item">
              <strong>Создано:</strong> {application.createdAt}
            </div>
            <div className="meta-item">
              <strong>Отдел:</strong> {application.department}
            </div>
            {application.assigned_to && (
              <div className="meta-item">
                <strong>Ответственный:</strong> {application.assigned_to}
              </div>
            )}
          </div>

          <div className="app-detail-content">
            <h4>Описание</h4>
            <p>{application.description}</p>
          </div>

          <div className="app-responses">
            <h4>История обработки</h4>
            {application.responses.length > 0 ? (
              <div className="responses-list">
                {application.responses.map(response => (
                  <div key={response.id} className={`response-item ${(response.is_official || response.isOfficial) ? 'official' : ''}`}>
                    <div className="response-header">
                      <span className="response-author">{response.author}</span>
                      <span className="response-date">{response.created_at || response.createdAt}</span>
                      {response.is_official && <span className="official-badge">Официальный ответ</span>}
                      {response.action && (
                        <span className={`action-badge action-${response.action}`}>
                          {response.action === 'accept' && '✅ Принято'}
                          {response.action === 'reject' && '❌ Отклонено'}
                          {response.action === 'close' && '🔒 Закрыто'}
                        </span>
                      )}
                    </div>
                    <div className="response-text">{response.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-responses">Ответов пока нет</p>
            )}
          </div>

          <div className="app-response-form">
            <h4>Добавить ответ</h4>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Введите ваш ответ..."
              className="response-textarea"
              rows="4"
            />
            
            {canManage && (
              <div className="response-actions">
                <label className="form-label">Тип ответа:</label>
                <select 
                  value={actionType}
                  onChange={(e) => handleActionTypeChange(e.target.value)}
                  className="action-select"
                >
                  <option value="response">Просто ответ</option>
                  <option value="accept">Принять заявление</option>
                  <option value="reject">Отклонить заявление</option>
                  <option value="close">Закрыть заявление</option>
                </select>
                {actionType !== 'response' && (
                  <p className="action-hint">
                    {actionType === 'accept' && '✅ Заявление будет принято и заявление закроется'}
                    {actionType === 'reject' && '❌ Заявление будет отклонено и заявление закроется'}
                    {actionType === 'close' && '🔒 Заявление будет закрыто'}
                  </p>
                )}
              </div>
            )}

            <div className="response-submit">
              <button 
                className="btn btn-primary"
                onClick={handleRespond}
                disabled={!responseText.trim() || isSubmitting}
              >
                {isSubmitting ? 'Отправка...' :
                 actionType === 'response' ? 'Отправить ответ' : 
                 actionType === 'accept' ? 'Принять и отправить' :
                 actionType === 'reject' ? 'Отклонить и отправить' :
                 'Закрыть и отправить'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
// src/components/Applications/ApplicationModal.jsx
import React, { useState } from 'react';

const ApplicationModal = ({ formType, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const getFormFields = () => {
    const baseFields = [
      { name: 'fullName', label: 'ФИО заявителя', type: 'text', required: true },
      { name: 'contact', label: 'Контактные данные', type: 'text', required: true },
      { name: 'description', label: 'Описание ситуации', type: 'textarea', required: true }
    ];

    const specificFields = {
      crime: [
        { name: 'crimeType', label: 'Вид преступления', type: 'select', options: ['Кража', 'Грабёж', 'Мошенничество', 'Хулиганство', 'Другое'], required: true },
        { name: 'location', label: 'Место происшествия', type: 'text', required: true },
        { name: 'time', label: 'Время происшествия', type: 'datetime-local', required: true },
        { name: 'suspects', label: 'Информация о подозреваемых', type: 'textarea' }
      ],
      violation: [
        { name: 'violationType', label: 'Вид нарушения', type: 'select', options: ['ПДД', 'Общественный порядок', 'Административные правонарушения'], required: true },
        { name: 'violatorInfo', label: 'Информация о нарушителе', type: 'textarea' },
        { name: 'evidence', label: 'Имеющиеся доказательства', type: 'textarea' }
      ],
      appeal: [
        { name: 'appealType', label: 'Тип обращения', type: 'select', options: ['Предложение', 'Вопрос', 'Запрос информации'], required: true },
        { name: 'department', label: 'Отдел обращения', type: 'select', options: ['Штаб', 'ОУР', 'ППСП'], required: true }
      ],
      complaint: [
        { name: 'complaintTarget', label: 'На кого жалоба', type: 'text', required: true },
        { name: 'incidentDate', label: 'Дата инцидента', type: 'date', required: true },
        { name: 'desiredOutcome', label: 'Желаемый результат', type: 'textarea' }
      ]
    };

    return [...baseFields, ...(specificFields[formType.id] || [])];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = formData.title || formData.fullName || `${formType.title} от ${formData.fullName || 'пользователя'}`;
    onSubmit({
      type: formType.title,
      title: title,
      ...formData,
      submissionDate: new Date().toISOString(),
      status: 'pending'
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fields = getFormFields();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="application-modal-header">
          <div className="application-icon">{formType.icon}</div>
          <div>
            <h2>{formType.title}</h2>
            <p>{formType.description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          {fields.map(field => (
            <div key={field.name} className="form-group">
              <label className="form-label">
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="4"
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="form-select"
                  required={field.required}
                >
                  <option value="">Выберите...</option>
                  {field.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="form-input"
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Подать заявление
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
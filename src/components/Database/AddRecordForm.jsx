// src/components/Database/AddRecordForm.jsx
import React, { useState } from 'react';

const AddRecordForm = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    document: '',
    caseNumber: '',
    caseType: 'Административное',
    status: 'Расследование',
    department: 'ОУР',
    officer: '',
    address: '',
    phone: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.fullName && formData.document) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Добавить запись в базу</h2>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ФИО *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Дата рождения</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Документ *</label>
              <input
                type="text"
                name="document"
                value={formData.document}
                onChange={handleChange}
                className="form-input"
                placeholder="Серия и номер"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Номер дела</label>
              <input
                type="text"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Тип дела</label>
              <select
                name="caseType"
                value={formData.caseType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Административное">Административное</option>
                <option value="Уголовное">Уголовное</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Статус</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Расследование">Расследование</option>
                <option value="Завершено">Завершено</option>
                <option value="Передано в суд">Передано в суд</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Отдел</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-select"
              >
                <option value="ОУР">ОУР</option>
                <option value="ППСП">ППСП</option>
                <option value="Штаб">Штаб</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ответственный</label>
              <input
                type="text"
                name="officer"
                value={formData.officer}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordForm;
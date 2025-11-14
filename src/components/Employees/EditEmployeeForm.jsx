// src/components/Employees/EditEmployeeForm.jsx
import React, { useState } from 'react';
import { RANKS, DEPARTMENT_CONFIG, STATUS_OPTIONS, STATUS_ALIAS_MAP } from '../../utils/constants';

const EditEmployeeForm = ({ employee, onSave, onClose }) => {
  const normalizeStatus = (value) => STATUS_ALIAS_MAP[value] || value || STATUS_OPTIONS[0];
  const [formData, setFormData] = useState({
    ...employee,
    status: normalizeStatus(employee.status)
  });

  const ranks = RANKS;
  const departments = DEPARTMENT_CONFIG;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'full_name' ? { name: value } : {})
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Редактирование сотрудника</h2>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ФИО *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name || formData.name || ''}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Звание</label>
              <select
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                className="form-select"
              >
                {ranks.map(rank => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Должность *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Подразделение</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-select"
              >
                {departments.map(dept => (
                  <option key={dept.id} value={dept.code}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Внутренний телефон</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="internal-001"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Личный номер</label>
              <input
                type="text"
                name="badgeNumber"
                value={formData.badgeNumber || ''}
                onChange={handleChange}
                className="form-input"
                placeholder="МВД-001"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Дата назначения</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate || ''}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Статус</label>
              <select
                name="status"
                value={formData.status || 'Активный'}
                onChange={handleChange}
                className="form-select"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Дополнительная информация</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              className="form-textarea"
              rows="3"
              placeholder="Дополнительные сведения о сотруднике..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeForm;
// src/components/Employees/EmployeeForm.jsx
import React, { useState } from 'react';
import { RANKS, STATUS_OPTIONS } from '../../utils/constants';

const EmployeeForm = ({ onSave, onClose, departments }) => {
  const departmentOptions = (departments && departments.length ? departments : []);
  const initialDepartment = departmentOptions[0]?.code || 'Штаб';
  const [formData, setFormData] = useState({
    full_name: '',
    rank: RANKS[0],
    position: '',
    department: initialDepartment,
    phone: '',
    badge_number: '',
    start_date: '',
    status: 'Активный'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.full_name && formData.position) {
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
        
        <h2>Добавить сотрудника</h2>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ФИО *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="form-input"
                placeholder="Иванов Иван Иванович"
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
                {RANKS.map(rank => (
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
                placeholder="Например: Следователь"
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
                {departmentOptions.map(dept => (
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
              <label className="form-label">Дата назначения</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Статус</label>
            <select
              name="status"
              value={formData.status}
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

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Добавить сотрудника
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
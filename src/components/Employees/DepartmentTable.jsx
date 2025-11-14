// src/components/Employees/DepartmentTable.jsx (обновляем с редактированием)
import React, { useState } from 'react';
import { updateEmployee, deleteEmployee as deleteEmployeeAPI } from '../../utils/api';
import EditEmployeeForm from './EditEmployeeForm';
import { RANKS, STATUS_OPTIONS, STATUS_ALIAS_MAP, STATUS_CLASS_MAP } from '../../utils/constants';
import './DepartmentTable.css';

const DepartmentTable = ({ department, employees, canEdit, onEmployeeUpdate, onEmployeeDelete }) => {
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [quickEdit, setQuickEdit] = useState(null);
  const rankOptions = RANKS;
  const normalizeStatus = (value) => STATUS_ALIAS_MAP[value] || value || STATUS_OPTIONS[0];

  if (!department || !employees) {
    return (
      <div className="no-data">
        <p>Нет данных для отображения</p>
      </div>
    );
  }

  const updateEmployeeHandler = async (updatedEmployee) => {
    try {
      const updated = await updateEmployee(updatedEmployee.id, updatedEmployee);
      if (onEmployeeUpdate) onEmployeeUpdate(updated);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Ошибка обновления сотрудника:', error);
      alert('Ошибка обновления сотрудника');
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) return;
    
    try {
      await deleteEmployeeAPI(id);
      if (onEmployeeDelete) onEmployeeDelete(id);
      alert('Сотрудник успешно удален!');
    } catch (error) {
      console.error('Ошибка удаления сотрудника:', error);
      alert('Ошибка удаления сотрудника');
    }
  };

  const handleQuickEdit = (employee, field) => {
    setQuickEdit({ employee, field, value: employee[field] });
  };

  const saveQuickEdit = () => {
    if (quickEdit) {
      updateEmployeeHandler({
        ...quickEdit.employee,
        [quickEdit.field]: quickEdit.value
      });
      setQuickEdit(null);
    }
  };

  return (
    <div className="department-section">
      <div 
        className="department-header"
        style={{ '--dept-gradient': department.gradient }}
      >
        <span 
          className="dept-ribbon" 
          style={{ backgroundImage: department.gradient }}
          aria-hidden="true"
        />
        <div className="dept-title">
          <span className="dept-icon">{department.icon}</span>
          <div>
            <h2>{department.name}</h2>
            {department.description && (
              <p className="dept-description">{department.description}</p>
            )}
          </div>
        </div>
        <div className="dept-stats">
          Всего сотрудников: {employees.length}
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Звание</th>
              <th>Должность</th>
              <th>Контакты</th>
              <th>Статус</th>
              {canEdit && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => {
              const normalizedStatus = normalizeStatus(employee.status);
              const statusClass = STATUS_CLASS_MAP[normalizedStatus] || 'active';

              return (
              <tr key={employee.id} className="employee-row">
                <td className="employee-name">
                  <div className="name-avatar">
                    <div className="avatar-circle">
                      {(employee.full_name || employee.name || '').split(' ').map(n => n[0]).join('')}
                    </div>
                    {canEdit ? (
                      <button 
                        className="editable-name"
                        onClick={() => handleQuickEdit(employee, 'full_name')}
                      >
                        {employee.full_name || employee.name}
                      </button>
                    ) : (
                      employee.full_name || employee.name
                    )}
                  </div>
                </td>
                <td>
                  {canEdit ? (
                    <select
                      value={employee.rank}
                      onChange={(e) => updateEmployeeHandler({
                        ...employee,
                        rank: e.target.value
                      })}
                      className="inline-select"
                    >
                      {rankOptions.map(rank => (
                        <option key={rank} value={rank}>{rank}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="rank-badge">{employee.rank}</span>
                  )}
                </td>
                <td>
                  {canEdit ? (
                    <input
                      type="text"
                      value={employee.position}
                      onChange={(e) => updateEmployeeHandler({
                        ...employee,
                        position: e.target.value
                      })}
                      className="inline-input"
                      placeholder="Должность"
                    />
                  ) : (
                    employee.position
                  )}
                </td>
                <td>
                  <div className="contact-info">
                    {canEdit ? (
                      <input
                        type="text"
                        value={employee.phone}
                        onChange={(e) => updateEmployeeHandler({
                          ...employee,
                          phone: e.target.value
                        })}
                        className="inline-input"
                        placeholder="Телефон"
                      />
                    ) : (
                      <span className="contact-phone">📞 {employee.phone}</span>
                    )}
                  </div>
                </td>
                <td>
                  {canEdit ? (
                    <select
                      value={normalizedStatus}
                      onChange={(e) => updateEmployeeHandler({
                        ...employee,
                        status: e.target.value
                      })}
                      className="inline-select status-select"
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`status-indicator status-${statusClass}`}>
                      {normalizedStatus === 'Активный' && '🟢 Активный'}
                      {normalizedStatus === 'Отпуск' && '🟡 Отпуск'}
                      {normalizedStatus === 'Больничный' && '🔴 Больничный'}
                      {normalizedStatus === 'Командировка' && '🔵 Командировка'}
                      {normalizedStatus === 'Неактивный' && '⚫ Неактивный'}
                    </span>
                  )}
                </td>
                {canEdit && (
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-small btn-secondary"
                        onClick={() => setEditingEmployee(employee)}
                      >
                        Полное редакт.
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => deleteEmployee(employee.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && (
        <div className="empty-department">
          <p>В этом отделе пока нет сотрудников</p>
          {canEdit && (
            <button className="btn btn-primary">
              + Добавить первого сотрудника
            </button>
          )}
        </div>
      )}

      {editingEmployee && (
        <EditEmployeeForm 
          employee={editingEmployee}
          onSave={updateEmployeeHandler}
          onClose={() => setEditingEmployee(null)}
        />
      )}

      {quickEdit && (
        <div className="quick-edit-overlay">
          <input
            type="text"
            value={quickEdit.value}
            onChange={(e) => setQuickEdit({...quickEdit, value: e.target.value})}
            className="editable-input"
            autoFocus
          />
          <div className="quick-edit-actions">
            <button className="btn btn-small btn-primary" onClick={saveQuickEdit}>
              ✓
            </button>
            <button className="btn btn-small btn-secondary" onClick={() => setQuickEdit(null)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentTable;
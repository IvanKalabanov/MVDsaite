// src/components/Employees/EmployeeTables.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getEmployees, 
  createEmployee, 
  getFiredEmployees, 
  deleteFiredEmployee 
} from '../../utils/api';
import DepartmentTable from './DepartmentTable';
import EmployeeForm from './EmployeeForm';
import { DEPARTMENT_CONFIG } from '../../utils/constants';
import './EmployeeTables.css';

const EmployeeTables = () => {
  const { hasRole } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firedEmployees, setFiredEmployees] = useState([]);
  const [firedLoading, setFiredLoading] = useState(true);

  const departments = DEPARTMENT_CONFIG;
  const [activeDepartment, setActiveDepartment] = useState(departments[0]?.id || 'staff');

  useEffect(() => {
    loadEmployees();
    loadFiredEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Ошибка загрузки сотрудников:', error);
      alert('Ошибка загрузки сотрудников. Данные берутся из локального хранилища.');
    } finally {
      setLoading(false);
    }
  };

  const loadFiredEmployees = async () => {
    try {
      setFiredLoading(true);
      const data = await getFiredEmployees();
      const sorted = (data || []).slice().sort((a, b) => {
        const aDate = a.firedAt ? new Date(a.firedAt) : new Date(0);
        const bDate = b.firedAt ? new Date(b.firedAt) : new Date(0);
        return bDate - aDate;
      });
      setFiredEmployees(sorted);
    } catch (error) {
      console.error('Ошибка загрузки уволенных сотрудников:', error);
      alert('Ошибка загрузки уволенных сотрудников. Данные берутся из локального хранилища.');
    } finally {
      setFiredLoading(false);
    }
  };

  // Группируем сотрудников по отделам
  const employeesData = departments.reduce((acc, dept) => {
    acc[dept.id] = employees.filter(
      (emp) => emp.department === dept.code || emp.department === dept.name
    );
    return acc;
  }, {});

  const addEmployee = async (newEmployee) => {
    try {
      const created = await createEmployee(newEmployee);
      setEmployees(prev => [...prev, created]);
      setShowAddForm(false);
      alert('Сотрудник успешно добавлен!');
    } catch (error) {
      console.error('Ошибка добавления сотрудника:', error);
      alert('Ошибка добавления сотрудника');
    }
  };

  const handleEmployeeUpdate = (updatedEmployee) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    ));
  };

  const handleEmployeeDelete = (employeeId) => {
    // Локально убираем из текущего списка; перенос в "уволенные" делает API
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    // Дополнительно обновляем список уволенных
    loadFiredEmployees();
  };

  const handleDeleteFired = async (employeeId) => {
    if (!window.confirm('Удалить запись из списка уволенных сотрудников?')) return;

    try {
      await deleteFiredEmployee(employeeId);
      setFiredEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    } catch (error) {
      console.error('Ошибка удаления уволенного сотрудника:', error);
      alert('Ошибка удаления уволенного сотрудника');
    }
  };

  return (
    <div className="employees-page">
      <div className="page-header">
        <div>
          <h1>Штатное расписание</h1>
          <p>Сотрудники подразделений МВД</p>
        </div>
        
        {(hasRole('leader') || hasRole('admin')) && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            + Добавить сотрудника
          </button>
        )}
      </div>

      {/* Навигация по отделам */}
      <div className="departments-nav">
        {departments.map(dept => (
          <button
            key={dept.id}
            className={`department-tab ${activeDepartment === dept.id ? 'active' : ''}`}
            onClick={() => setActiveDepartment(dept.id)}
          >
            <span className="dept-icon" aria-hidden="true">{dept.icon}</span>
            <div className="dept-label">
              <span className="dept-name">{dept.name}</span>
              {dept.description && (
                <span className="dept-subtitle">{dept.description}</span>
              )}
            </div>
            <span className="employee-count">{employeesData[dept.id]?.length || 0}</span>
          </button>
        ))}
      </div>

      {/* Таблица активного отдела */}
      <DepartmentTable 
        department={departments.find(d => d.id === activeDepartment)}
        employees={employeesData[activeDepartment]}
        canEdit={hasRole('leader') || hasRole('admin')}
        onEmployeeUpdate={handleEmployeeUpdate}
        onEmployeeDelete={handleEmployeeDelete}
      />

      {showAddForm && (
        <EmployeeForm 
          onSave={addEmployee}
          onClose={() => setShowAddForm(false)}
          departments={departments}
        />
      )}

      {/* Уволенные сотрудники */}
      <div className="fired-employees-section">
        <div className="page-header" style={{ marginTop: '40px' }}>
          <div>
            <h2>Уволенные сотрудники</h2>
            <p>Список сотрудников, удалённых из основного штатного расписания</p>
            <p>Всего уволенных: {firedEmployees.length}</p>
          </div>
        </div>

        {firedLoading ? (
          <div className="no-data">
            <p>Загрузка уволенных сотрудников...</p>
          </div>
        ) : firedEmployees.length === 0 ? (
          <div className="no-data">
            <p>Уволенных сотрудников нет</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>Звание</th>
                  <th>Должность</th>
                  <th>Подразделение</th>
                  <th>Телефон</th>
                  <th>Дата увольнения</th>
                  <th>Причина</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {firedEmployees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.full_name || emp.name}</td>
                    <td>{emp.rank}</td>
                    <td>{emp.position}</td>
                    <td>{emp.department}</td>
                    <td>{emp.phone || '-'}</td>
                    <td>{emp.firedAt || '-'}</td>
                    <td>{emp.reason || '-'}</td>
                    <td>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => handleDeleteFired(emp.id)}
                      >
                        Удалить из списка
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTables;
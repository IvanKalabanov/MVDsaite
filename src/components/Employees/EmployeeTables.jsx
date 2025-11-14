// src/components/Employees/EmployeeTables.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getEmployees, createEmployee } from '../../utils/api';
import DepartmentTable from './DepartmentTable';
import EmployeeForm from './EmployeeForm';
import { DEPARTMENT_CONFIG } from '../../utils/constants';
import './EmployeeTables.css';

const EmployeeTables = () => {
  const { hasRole } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const departments = DEPARTMENT_CONFIG;
  const [activeDepartment, setActiveDepartment] = useState(departments[0]?.id || 'staff');

  useEffect(() => {
    loadEmployees();
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
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
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
    </div>
  );
};

export default EmployeeTables;
// src/components/Fleet/FleetTables.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFleet, createFleetItem, updateFleetItem, deleteFleetItem } from '../../utils/api';
import { DEPARTMENT_CONFIG } from '../../utils/constants';
import FleetDepartmentTable from './FleetDepartmentTable';
import './FleetTables.css';

const FleetTables = () => {
  const { hasRole } = useAuth();
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDepartment, setActiveDepartment] = useState(DEPARTMENT_CONFIG[0]?.id || 'staff');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadFleet();
  }, []);

  const loadFleet = async () => {
    try {
      setLoading(true);
      const data = await getFleet();
      setFleet(data || []);
    } catch (error) {
      console.error('Ошибка загрузки автопарка:', error);
      alert('Ошибка загрузки автопарка. Данные берутся из локального хранилища.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (itemData) => {
    try {
      const created = await createFleetItem(itemData);
      setFleet(prev => [...prev, created]);
    } catch (error) {
      console.error('Ошибка добавления транспорта:', error);
      alert('Ошибка добавления транспорта');
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updated = await updateFleetItem(id, updates);
      setFleet(prev => prev.map(item => item.id === updated.id ? updated : item));
    } catch (error) {
      console.error('Ошибка обновления транспорта:', error);
      alert('Ошибка обновления транспорта');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить транспортное средство из автопарка?')) return;
    try {
      await deleteFleetItem(id);
      setFleet(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Ошибка удаления транспорта:', error);
      alert('Ошибка удаления транспорта');
    }
  };

  const fleetByDept = DEPARTMENT_CONFIG.reduce((acc, dept) => {
    acc[dept.id] = fleet.filter(
      car => car.department === dept.code || car.department === dept.name
    );
    return acc;
  }, {});

  const canEdit = hasRole('leader') || hasRole('admin');

  const activeDept = DEPARTMENT_CONFIG.find(d => d.id === activeDepartment);
  const activeDeptItems = fleetByDept[activeDepartment] || [];
  const filteredItems = activeDeptItems.filter(car => {
    if (statusFilter === 'all') return true;
    return car.status === statusFilter;
  });

  return (
    <div className="fleet-page">
      <div className="page-header">
        <div>
          <h1>Автопарк МВД</h1>
          <p>Транспортные средства по подразделениям</p>
          <p>
            Активное подразделение: {activeDept?.name || '-'} · Машин: {filteredItems.length}
          </p>
        </div>
      </div>

      <div className="departments-nav">
        {DEPARTMENT_CONFIG.map(dept => (
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
            <span className="employee-count">{fleetByDept[dept.id]?.length || 0}</span>
          </button>
        ))}
      </div>

      <div className="fleet-filters">
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Все статусы</option>
          <option value="В строю">В строю</option>
          <option value="В ремонте">В ремонте</option>
          <option value="Списан">Списан</option>
        </select>
      </div>

      <FleetDepartmentTable
        department={activeDept}
        items={filteredItems}
        canEdit={canEdit}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default FleetTables;

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
  // В автопарке добавляем виртуальный раздел "Руководство" первым
  const leadershipDept = {
    id: 'leadership',
    code: 'Руководство',
    name: 'Руководство',
    icon: '👔',
    gradient: 'linear-gradient(135deg, #0f4c81, #1b6ca8)',
    description: 'Транспорт, закреплённый за начальником МВД и его заместителем'
  };
  const navDepartments = [leadershipDept, ...DEPARTMENT_CONFIG];
  const [activeDepartment, setActiveDepartment] = useState('leadership');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    department: DEPARTMENT_CONFIG[0]?.code || DEPARTMENT_CONFIG[0]?.name || '',
    type: '',
    model: '',
    plate: '',
    status: 'В строю',
    notes: ''
  });

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
      setShowAddModal(false);
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

  // Отдельно храним транспорт руководства (isLeadership === true)
  const leadershipFleet = fleet.filter(car => car.isLeadership);

  // Остальной транспорт по подразделениям, без машин руководства
  const fleetByDept = DEPARTMENT_CONFIG.reduce((acc, dept) => {
    acc[dept.id] = fleet.filter(
      car => !car.isLeadership && (car.department === dept.code || car.department === dept.name)
    );
    return acc;
  }, {});

  const canEdit = hasRole('leader') || hasRole('admin');

  const activeDept = activeDepartment === 'leadership'
    ? leadershipDept
    : DEPARTMENT_CONFIG.find(d => d.id === activeDepartment);

  const activeDeptItems = activeDepartment === 'leadership'
    ? leadershipFleet
    : (fleetByDept[activeDepartment] || []);
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
        {canEdit && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setNewItem({
                // Для руководства всегда сохраняем в условный "Штаб" как служебный транспорт,
                // для остальных отделов — в код/название активного подразделения
                department: activeDepartment === 'leadership'
                  ? 'Штаб'
                  : (activeDept?.code || activeDept?.name || ''),
                type: '',
                model: '',
                plate: '',
                status: 'В строю',
                notes: ''
              });
              setShowAddModal(true);
            }}
          >
            + Добавить транспорт
          </button>
        )}
      </div>

      <div className="departments-nav">
        {navDepartments.map(dept => (
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
            <span className="employee-count">
              {dept.id === 'leadership'
                ? leadershipFleet.length
                : (fleetByDept[dept.id]?.length || 0)}
            </span>
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
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      {showAddModal && canEdit && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content large-modal fleet-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            <div className="fleet-modal-header">
              <div className="fleet-modal-icon">🚓</div>
              <div>
                <h2>Добавить транспортное средство</h2>
                <p className="fleet-modal-subtitle">
                  Укажите характеристики, подразделение и при необходимости отметьте, что транспорт относится к руководству (Штаб).
                </p>
              </div>
            </div>
            <form
              className="fleet-add-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newItem.type || !newItem.model || !newItem.plate) return;
                handleCreate({
                  ...newItem,
                  department: activeDepartment === 'leadership'
                    ? 'Штаб'
                    : (activeDept?.code || activeDept?.name || newItem.department),
                  isLeadership: activeDepartment === 'leadership'
                });
              }}
            >
              <div className="fleet-add-grid">
                <input
                  type="text"
                  name="type"
                  value={newItem.type}
                  onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                  className="form-input"
                  placeholder="Тип (патрульный, оперативный и т.п.)"
                  required
                />
                <input
                  type="text"
                  name="model"
                  value={newItem.model}
                  onChange={(e) => setNewItem(prev => ({ ...prev, model: e.target.value }))}
                  className="form-input"
                  placeholder="Модель"
                  required
                />
                <input
                  type="text"
                  name="plate"
                  value={newItem.plate}
                  onChange={(e) => setNewItem(prev => ({ ...prev, plate: e.target.value }))}
                  className="form-input"
                  placeholder="Госномер"
                  required
                />
                <select
                  name="status"
                  value={newItem.status}
                  onChange={(e) => setNewItem(prev => ({ ...prev, status: e.target.value }))}
                  className="form-select"
                >
                  <option value="В строю">В строю</option>
                  <option value="В ремонте">В ремонте</option>
                  <option value="Списан">Списан</option>
                </select>
                <input
                  type="text"
                  name="notes"
                  value={newItem.notes}
                  onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                  className="form-input"
                  placeholder="Примечание"
                />
              </div>
              <div className="fleet-modal-options">
                <span className="fleet-modal-dept-hint">
                  Будет сохранён в: {activeDepartment === 'leadership'
                    ? 'Руководство (служебный транспорт "Штаб")'
                    : (activeDept?.name || 'выбранное подразделение')}
                </span>
              </div>
              <div className="form-actions" style={{ marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                  + Добавить в автопарк
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetTables;

// src/components/Fleet/FleetDepartmentTable.jsx
import React, { useState } from 'react';
import './FleetTables.css';

const emptyItem = (departmentCode) => ({
  department: departmentCode,
  type: '',
  model: '',
  plate: '',
  status: 'В строю',
  notes: ''
});

const FleetDepartmentTable = ({ department, items, canEdit, onCreate, onUpdate, onDelete }) => {
  const [newItem, setNewItem] = useState(() => emptyItem(department?.code || department?.name || ''));
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);

  if (!department) {
    return (
      <div className="no-data">
        <p>Не выбрано подразделение</p>
      </div>
    );
  }

  const handleChangeNew = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNew = (e) => {
    e.preventDefault();
    if (!newItem.type || !newItem.model || !newItem.plate) return;
    onCreate(newItem);
    setNewItem(emptyItem(department.code || department.name));
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditDraft({ ...item });
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditDraft(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
    if (!editDraft) return;
    onUpdate(editDraft.id, editDraft);
    setEditingId(null);
    setEditDraft(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const renderRow = (item) => {
    const isEditing = editingId === item.id;
    const data = isEditing ? editDraft : item;

    return (
      <tr key={item.id} className="fleet-row">
        <td>
          {isEditing && canEdit ? (
            <input
              type="text"
              name="type"
              value={data.type}
              onChange={handleChangeEdit}
              className="inline-input"
              placeholder="Тип"
            />
          ) : (
            data.type
          )}
        </td>
        <td>
          {isEditing && canEdit ? (
            <input
              type="text"
              name="model"
              value={data.model}
              onChange={handleChangeEdit}
              className="inline-input"
              placeholder="Модель"
            />
          ) : (
            data.model
          )}
        </td>
        <td>
          {isEditing && canEdit ? (
            <input
              type="text"
              name="plate"
              value={data.plate}
              onChange={handleChangeEdit}
              className="inline-input"
              placeholder="Госномер"
            />
          ) : (
            data.plate
          )}
        </td>
        <td>
          {isEditing && canEdit ? (
            <select
              name="status"
              value={data.status}
              onChange={handleChangeEdit}
              className="inline-select"
            >
              <option value="В строю">В строю</option>
              <option value="В ремонте">В ремонте</option>
              <option value="Списан">Списан</option>
            </select>
          ) : (
            <span className={`status-badge status-${data.status === 'В строю' ? 'active' : data.status === 'В ремонте' ? 'warning' : 'inactive'}`}>
              {data.status}
            </span>
          )}
        </td>
        <td>
          {isEditing && canEdit ? (
            <input
              type="text"
              name="notes"
              value={data.notes || ''}
              onChange={handleChangeEdit}
              className="inline-input"
              placeholder="Примечание"
            />
          ) : (
            data.notes || '-'
          )}
        </td>
        {canEdit && (
          <td>
            {isEditing ? (
              <div className="action-buttons">
                <button className="btn btn-small btn-primary" onClick={saveEdit}>Сохранить</button>
                <button className="btn btn-small btn-secondary" onClick={cancelEdit}>Отмена</button>
              </div>
            ) : (
              <div className="action-buttons">
                <button className="btn btn-small btn-secondary" onClick={() => startEdit(item)}>Редакт.</button>
                <button className="btn btn-small btn-danger" onClick={() => onDelete(item.id)}>Удалить</button>
              </div>
            )}
          </td>
        )}
      </tr>
    );
  };

  return (
    <div className="fleet-department-section">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Тип</th>
              <th>Модель</th>
              <th>Госномер</th>
              <th>Статус</th>
              <th>Примечания</th>
              {canEdit && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map(renderRow)
            ) : (
              <tr>
                <td colSpan={canEdit ? 6 : 5} className="empty-cell">
                  Транспортных средств в этом подразделении пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {canEdit && (
        <form className="fleet-add-form" onSubmit={handleSubmitNew}>
          <h3>Добавить транспортное средство</h3>
          <div className="fleet-add-grid">
            <input
              type="text"
              name="type"
              value={newItem.type}
              onChange={handleChangeNew}
              className="form-input"
              placeholder="Тип (патрульный, оперативный и т.п.)"
              required
            />
            <input
              type="text"
              name="model"
              value={newItem.model}
              onChange={handleChangeNew}
              className="form-input"
              placeholder="Модель"
              required
            />
            <input
              type="text"
              name="plate"
              value={newItem.plate}
              onChange={handleChangeNew}
              className="form-input"
              placeholder="Госномер"
              required
            />
            <select
              name="status"
              value={newItem.status}
              onChange={handleChangeNew}
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
              onChange={handleChangeNew}
              className="form-input"
              placeholder="Примечание"
            />
            <button type="submit" className="btn btn-primary">
              + Добавить в автопарк
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FleetDepartmentTable;

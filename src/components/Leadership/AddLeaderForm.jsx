// src/components/Leadership/AddLeaderForm.jsx
import React, { useState } from 'react';
import { DEPARTMENT_CONFIG } from '../../utils/constants';
import './AddLeaderForm.css';

const AddLeaderForm = ({ onAdd, onCancel, departments = DEPARTMENT_CONFIG }) => {
  const departmentOptions = departments && departments.length ? departments : DEPARTMENT_CONFIG;
  const [formData, setFormData] = useState({
    full_name: '',
    position: '',
    department: departmentOptions[0]?.code || 'Штаб',
    photo: '',
    bio: '',
    contacts: ''
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.full_name && formData.position) {
      onAdd(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUrlChange = (e) => {
    const value = e.target.value;
    setPhotoUrlInput(value);
    setFormData(prev => ({ ...prev, photo: value }));
    setPhotoPreview(value);
    setUploadError('');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Размер файла превышает 2 МБ. Сожмите изображение или выберите другое.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photo: reader.result }));
      setPhotoPreview(reader.result);
      setPhotoUrlInput('');
      setUploadError('');
    };
    reader.readAsDataURL(file);
  };

  const resetPhoto = () => {
    setFormData(prev => ({ ...prev, photo: '' }));
    setPhotoPreview('');
    setPhotoUrlInput('');
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel}>×</button>
        
        <div className="modal-header">
          <div>
            <p className="modal-eyebrow">Новый руководитель</p>
            <h2>Добавить руководителя</h2>
            <p className="modal-subtitle">
              Фото, краткая биография и контакты помогут сотрудникам и гражданам быстро узнавать ответственных.
            </p>
          </div>
        </div>
        
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
                placeholder="Например: Иванов Иван Иванович"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Подразделение *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-select"
              >
                {departmentOptions.map(dept => (
                  <option key={dept.id} value={dept.code}>
                    {dept.icon} {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Должность *</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="form-input"
              placeholder="Например: Начальник Штаба"
              required
            />
          </div>

          <div className="photo-upload-block">
            <div className="photo-upload-header">
              <div>
                <label className="form-label">Фотография</label>
                <p className="form-hint">Загрузите изображение JPG/PNG до 2 МБ или укажите ссылку</p>
              </div>
              {photoPreview && (
                <button type="button" className="btn-link" onClick={resetPhoto}>
                  Очистить
                </button>
              )}
            </div>

            <div className="photo-upload">
              <label className="upload-dropzone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <span>Перетащите файл сюда или нажмите для выбора</span>
                <small>Поддерживаются JPG, PNG, WEBP</small>
              </label>

              {photoPreview ? (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Превью руководителя" />
                </div>
              ) : (
                <div className="photo-placeholder">
                  <span>Превью появится после загрузки</span>
                </div>
              )}
            </div>

            <input
              type="url"
              name="photoLink"
              value={photoUrlInput}
              onChange={handlePhotoUrlChange}
              className="form-input photo-url-input"
              placeholder="Или вставьте ссылку на изображение"
            />

            {uploadError && <p className="upload-error">{uploadError}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Биография</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              placeholder="Опишите ключевые заслуги, профиль и направления работы"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Контакты</label>
            <input
              type="text"
              name="contacts"
              value={formData.contacts}
              onChange={handleChange}
              className="form-input"
              placeholder="Например: +7 (999) 000-00-00, кабинет 205"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
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

export default AddLeaderForm;
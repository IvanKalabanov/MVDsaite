// src/components/News/AddNewsForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AddNewsForm.css';

const AddNewsForm = ({ onAdd, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: user.name || 'Администратор'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert('Заполните обязательные поля: заголовок и содержание');
      return;
    }

    const newNews = {
      id: Date.now(),
      title: formData.title,
      excerpt: formData.excerpt || formData.content.substring(0, 100) + '...',
      content: formData.content,
      image: formData.image || 'https://via.placeholder.com/400/200?text=News',
      date: new Date().toISOString().split('T')[0],
      author: formData.author || user.name || 'Администратор'
    };

    onAdd(newNews);
    
    // Сброс формы
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      author: user.name || 'Администратор'
    });
  };

  return (
    <div className="add-news-form-container">
      <div className="add-news-form-header">
        <h2>Добавить новость</h2>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>
      
      <form onSubmit={handleSubmit} className="add-news-form">
        <div className="form-group">
          <label className="form-label">Заголовок *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Введите заголовок новости"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Краткое описание</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
            placeholder="Краткое описание новости (будет сгенерировано автоматически, если не заполнено)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Содержание *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="form-textarea"
            rows="6"
            placeholder="Полный текст новости"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">URL изображения</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Автор</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="form-input"
            placeholder="Имя автора (по умолчанию: Администратор)"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary">
            Опубликовать
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewsForm;


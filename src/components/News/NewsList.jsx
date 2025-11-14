// src/components/News/NewsList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getNews, createNews, deleteNews } from '../../utils/api';
import NewsCard from './NewsCard';
import NewsModal from './NewsModal';
import AddNewsForm from './AddNewsForm';
import './NewsList.css';

const NewsList = () => {
  const { user, hasRole } = useAuth();
  const [selectedNews, setSelectedNews] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const news = await getNews();
      setNewsData(news);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
      alert('Ошибка загрузки новостей. Попробуйте обновить страницу — используется локальное хранилище.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNews = async (newNews) => {
    try {
      const created = await createNews(newNews);
      setNewsData(prev => [created, ...prev]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Ошибка создания новости:', error);
      alert('Ошибка создания новости');
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту новость?')) return;
    
    try {
      await deleteNews(newsId);
      setNewsData(prev => prev.filter(n => n.id !== newsId));
    } catch (error) {
      console.error('Ошибка удаления новости:', error);
      alert('Ошибка удаления новости');
    }
  };

  const canAddNews = hasRole('leader') || hasRole('admin');

  return (
    <div className="news-list">
      <div className="news-header">
        <div className="news-header-content">
          <h1>Новости МВД</h1>
          <p>Актуальная информация и объявления</p>
        </div>
        {canAddNews && (
          <button 
            className="btn btn-primary add-news-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✕ Отменить' : '+ Добавить новость'}
          </button>
        )}
      </div>

      {showAddForm && canAddNews && (
        <AddNewsForm 
          onAdd={handleAddNews}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">Загрузка новостей...</div>
      ) : newsData.length === 0 ? (
        <div className="no-news">
          <div className="no-news-icon">📰</div>
          <h3>Новостей пока нет</h3>
          <p>Будьте первым, кто добавит новость!</p>
        </div>
      ) : (
        <div className="news-grid">
          {newsData.map(news => (
            <NewsCard 
              key={news.id} 
              news={news} 
              onReadMore={() => setSelectedNews(news)}
              onDelete={canAddNews ? () => handleDeleteNews(news.id) : null}
              canDelete={canAddNews}
            />
          ))}
        </div>
      )}

      {selectedNews && (
        <NewsModal 
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}
    </div>
  );
};

export default NewsList;
// src/components/News/NewsCard.jsx
import React from 'react';
import './NewsCard.css';

const NewsCard = ({ news, onReadMore, onDelete, canDelete }) => {
  return (
    <div className="news-card card">
      {canDelete && onDelete && (
        <button 
          className="news-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Удалить новость"
        >
          ×
        </button>
      )}
      <div className="news-image">
        <img src={news.image} alt={news.title} onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400/200?text=News';
        }} />
      </div>
      <div className="news-content">
        <div className="news-meta">
          <span className="news-date">📅 {news.date}</span>
          <span className="news-author">✍️ {news.author}</span>
        </div>
        <h3 className="news-title">{news.title}</h3>
        <p className="news-excerpt">{news.excerpt}</p>
        <button 
          className="btn btn-primary"
          onClick={onReadMore}
        >
          Читать полностью →
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
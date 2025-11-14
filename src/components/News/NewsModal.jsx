// src/components/News/NewsModal.jsx
import React from 'react';
import './NewsModal.css';

const NewsModal = ({ news, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content news-modal-wrapper" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="news-modal">
          <div className="news-modal-image">
            <img 
              src={news.image} 
              alt={news.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400/200?text=News';
              }}
            />
          </div>
          
          <div className="news-modal-header">
            <div className="news-modal-meta">
              <span className="news-modal-date">📅 {news.date}</span>
              <span className="news-modal-author">✍️ {news.author}</span>
            </div>
            <h2 className="news-modal-title">{news.title}</h2>
          </div>
          
          <div className="news-modal-content">
            <p>{news.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
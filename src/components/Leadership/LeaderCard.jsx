// src/components/Leadership/LeaderCard.jsx
import React from 'react';
import './LeaderCard.css';

const FALLBACK_PHOTO = 'https://via.placeholder.com/320x320/0A2A43/FFFFFF?text=Leader';

const LeaderCard = ({ leader, onDelete, canDelete }) => {
  const displayName = leader.full_name || leader.name || 'Без имени';
  const position = leader.position || 'Должность не указана';
  const bio = leader.bio || 'Информация будет дополняться в ближайшее время.';
  const contacts = leader.contacts || leader.phone || leader.email || '';
  const departmentLabel = leader.department || '—';
  const photoSrc = leader.photo || leader.image || FALLBACK_PHOTO;

  return (
    <div className="leader-card card">
      {canDelete && onDelete && (
        <button 
          className="leader-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Удалить руководителя"
        >
          ×
        </button>
      )}

      <div className="leader-image">
        <img 
          src={photoSrc} 
          alt={displayName}
          loading="lazy"
          onError={(e) => {
            e.target.src = FALLBACK_PHOTO;
          }}
        />
        <div className="leader-badge">{departmentLabel}</div>
      </div>
      
      <div className="leader-info">
        <div className="leader-meta">
          <h3 className="leader-name">{displayName}</h3>
          <p className="leader-position">{position}</p>
        </div>

        <p className="leader-bio">{bio}</p>

        {contacts && (
          <div className="leader-contacts">
            <span className="contacts-label">Контакты</span>
            <span className="contacts-value">{contacts}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderCard;
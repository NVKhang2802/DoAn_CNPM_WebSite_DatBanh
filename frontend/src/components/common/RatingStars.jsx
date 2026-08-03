import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5, size = 16, count = null }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={star <= Math.round(rating) ? '#E0A96D' : 'none'}
          color={star <= Math.round(rating) ? '#E0A96D' : '#D4A373'}
        />
      ))}
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6D4C41', marginLeft: '4px' }}>
        {Number(rating).toFixed(1)}
      </span>
      {count !== null && (
        <span style={{ fontSize: '0.8rem', color: '#8D7B68' }}>({count})</span>
      )}
    </div>
  );
};

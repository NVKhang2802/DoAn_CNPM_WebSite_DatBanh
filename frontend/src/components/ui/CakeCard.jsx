import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { useCart } from '../../context/CartContext';

export const CakeCard = ({ cake }) => {
  const { addToCart } = useCart();
  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cake.GIA);

  return (
    <div className="cake-card">
      <div className="cake-card-img-wrapper">
        <img
          src={cake.ANHSP || '/uploads/hinh1.png'}
          alt={cake.TENSP}
          className="cake-card-img"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'; }}
        />
        <span
          className={`badge ${cake.TRANGTHAI === 'CÒN HÀNG' ? 'badge-success' : 'badge-danger'}`}
          style={{ position: 'absolute', top: '12px', left: '12px' }}
        >
          {cake.TRANGTHAI}
        </span>
        {cake.KICHCO && (
          <span
            className="badge badge-info"
            style={{ position: 'absolute', top: '12px', right: '12px' }}
          >
            Size {cake.KICHCO}
          </span>
        )}
      </div>

      <div className="cake-card-body">
        <div style={{ marginBottom: '8px' }}>
          <RatingStars rating={cake.DIEM_DANHGIA || 5} count={cake.SO_LUOT_DANHGIA} />
        </div>

        <Link to={`/products/${cake.MASP}`}>
          <h3 className="cake-card-title">{cake.TENSP}</h3>
        </Link>

        <p style={{ fontSize: '0.85rem', color: '#8D7B68', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.6em' }}>
          {cake.MOTA}
        </p>

        <div className="flex items-center justify-between" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
          <span className="cake-card-price">{formattedPrice}</span>
          
          <div className="flex gap-2">
            <Link to={`/products/${cake.MASP}`} className="btn btn-secondary btn-sm" title="Xem chi tiết">
              <Eye size={16} />
            </Link>

            <button
              onClick={() => addToCart(cake.MASP, 1)}
              className="btn btn-primary btn-sm"
              disabled={cake.TRANGTHAI !== 'CÒN HÀNG'}
              title="Thêm vào giỏ"
            >
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

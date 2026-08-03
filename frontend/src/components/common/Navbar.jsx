import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, User, LogOut, Shield, Cake, Search } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="navbar-sticky">
      <div className="container flex items-center justify-between" style={{ height: '80px' }}>
        <Link to="/" className="navbar-brand">
          <Cake size={32} color="#D4A373" />
          <span>Cake Artisan</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/" className="nav-link">Trang chủ</Link>
          <Link to="/products" className="nav-link">Thực đơn bánh</Link>
          <Link to="/about" className="nav-link">Về chúng tôi</Link>
          {isAdmin && (
            <Link to="/admin" className="nav-link flex items-center gap-2" style={{ color: '#D32F2F', fontWeight: 700 }}>
              <Shield size={16} /> Quản trị Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="btn btn-secondary flex items-center gap-2" style={{ position: 'relative' }}>
            <ShoppingBag size={20} />
            <span>Giỏ hàng</span>
            {itemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#E76F51',
                  color: '#FFF',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 btn btn-outline btn-sm">
                <User size={16} />
                <span>{user.hoten}</span>
              </Link>
              <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-secondary btn-sm" title="Đăng xuất">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-secondary btn-sm">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

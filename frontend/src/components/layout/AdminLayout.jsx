import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Cake, ShoppingCart, ShieldAlert, LogOut, ArrowLeft } from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Thống kê Tổng quan', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/products', label: 'Quản lý Mẫu Bánh', icon: <Cake size={20} /> },
    { path: '/admin/orders', label: 'Quản lý Đơn Hàng', icon: <ShoppingCart size={20} /> },
    { path: '/admin/logs', label: 'Nhật Ký Bảo Mật', icon: <ShieldAlert size={20} /> },
  ];

  return (
    <div className="flex" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#2B1E16', color: '#FFF', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '32px' }}>
          <div className="flex items-center gap-2" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#E0A96D' }}>
            <Cake size={28} />
            <span>Artisan Admin</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#A09080' }}>Enterprise Portal v1.0</span>
        </div>

        <nav className="flex flex-col gap-2" style={{ flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3"
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: isActive ? '#3C2A21' : '#C5B5A5',
                  background: isActive ? '#E0A96D' : 'transparent',
                  transition: '0.2s ease',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }} className="flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-2" style={{ color: '#C5B5A5', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Về Trang Cửa Hàng
          </Link>
          <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-2" style={{ color: '#E76F51', fontSize: '0.9rem', cursor: 'pointer' }}>
            <LogOut size={16} /> Đăng xuất Admin
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

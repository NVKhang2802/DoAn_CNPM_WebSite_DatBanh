import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Cake, Lock, User } from 'lucide-react';

export const LoginPage = () => {
  const [tendn, setTendn] = useState('');
  const [matkhau, setMatkhau] = useState('');
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(tendn, matkhau);
      showToast(`Đăng nhập thành công! Chào mừng ${user.hoten} trở lại.`);
      if (user.role === 'ADMIN' || user.role === 'QUẢN LÝ') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh', padding: '40px 0' }}>
      <div style={{ background: '#FFF', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Cake size={48} color="#D4A373" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.8rem', color: '#3C2A21' }}>Đăng Nhập</h2>
          <p style={{ color: '#8D7B68', fontSize: '0.9rem', marginTop: '4px' }}>Dành cho Khách hàng & Nhân viên quản trị</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên đăng nhập:</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="Nhập tên đăng nhập (ví dụ: an01 hoặc admin)"
                value={tendn}
                onChange={(e) => setTendn(e.target.value)}
                required
              />
              <User size={18} color="#8D7B68" style={{ position: 'absolute', left: '14px', top: '12px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu:</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="Nhập mật khẩu..."
                value={matkhau}
                onChange={(e) => setMatkhau(e.target.value)}
                required
              />
              <Lock size={18} color="#8D7B68" style={{ position: 'absolute', left: '14px', top: '12px' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
            {loading ? 'Đang Xác Thực...' : 'Đăng Nhập'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#5C4A3E' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: '#E76F51', fontWeight: 700 }}>
            Đăng ký ngay
          </Link>
        </div>

        <div style={{ marginTop: '20px', padding: '12px', background: 'var(--cream-soft)', borderRadius: '10px', fontSize: '0.8rem', color: '#6D4C41' }}>
          <strong>Tài khoản thử nghiệm:</strong><br />
          - Khách hàng: <code>an01</code> / Pass: <code>123</code><br />
          - Admin Quản trị: <code>admin</code> / Pass: <code>123456</code>
        </div>
      </div>
    </div>
  );
};

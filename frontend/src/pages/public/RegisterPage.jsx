import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Cake, User, Mail, Phone, MapPin, Lock } from 'lucide-react';

export const RegisterPage = () => {
  const [form, setForm] = useState({
    hoten: '',
    tendn: '',
    matkhau: '',
    email: '',
    sdt: '',
    diachi: '',
  });

  const { register, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      showToast('Đăng ký tài khoản thành công!');
      navigate('/');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh', padding: '40px 0' }}>
      <div style={{ background: '#FFF', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Cake size={48} color="#D4A373" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.8rem', color: '#3C2A21' }}>Đăng Ký Thành Viên</h2>
          <p style={{ color: '#8D7B68', fontSize: '0.9rem', marginTop: '4px' }}>Tạo tài khoản để đặt bánh và tích điểm ưu đãi</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Họ và tên *:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nguyễn Văn A"
              value={form.hoten}
              onChange={(e) => setForm({ ...form, hoten: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tên đăng nhập *:</label>
            <input
              type="text"
              className="form-input"
              placeholder="vanchua123"
              value={form.tendn}
              onChange={(e) => setForm({ ...form, tendn: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *:</label>
            <input
              type="email"
              className="form-input"
              placeholder="vidu@gmail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu *:</label>
            <input
              type="password"
              className="form-input"
              placeholder="Mật khẩu tối thiểu 6 ký tự"
              value={form.matkhau}
              onChange={(e) => setForm({ ...form, matkhau: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Số điện thoại *:</label>
            <input
              type="text"
              className="form-input"
              placeholder="0912345678"
              value={form.sdt}
              onChange={(e) => setForm({ ...form, sdt: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Địa chỉ giao bánh mặc định:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Địa chỉ nhận bánh của bạn..."
              value={form.diachi}
              onChange={(e) => setForm({ ...form, diachi: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
            {loading ? 'Đang Tạo Tài Khoản...' : 'Hoàn Tất Đăng Ký'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#5C4A3E' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: '#E76F51', fontWeight: 700 }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

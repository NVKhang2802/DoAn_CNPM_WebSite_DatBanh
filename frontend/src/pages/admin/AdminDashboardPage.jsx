import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { DollarSign, ShoppingCart, Users, Cake, TrendingUp } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [data, setData] = useState({ overview: null, topProducts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboardData()
      .then((res) => setData(res.data || {}))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '40px' }}>Đang tải thống kê doanh thu...</div>;

  const { overview, topProducts } = data;
  const formattedRevenue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(overview?.TONG_DOANH_THU || 0);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: '#3C2A21', marginBottom: '24px' }}>Báo Cáo & Thống Kê Tổng Quan</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '40px' }}>
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <span style={{ color: '#8D7B68', fontSize: '0.9rem', fontWeight: 600 }}>Tổng Doanh Thu</span>
            <div style={{ padding: '8px', background: '#E8F5E9', borderRadius: '10px' }}><DollarSign color="#2E7D32" size={24} /></div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3C2A21' }}>{formattedRevenue}</div>
        </div>

        <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <span style={{ color: '#8D7B68', fontSize: '0.9rem', fontWeight: 600 }}>Tổng Đơn Hàng</span>
            <div style={{ padding: '8px', background: '#FFF3E0', borderRadius: '10px' }}><ShoppingCart color="#ED6C02" size={24} /></div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3C2A21' }}>{overview?.TONG_DON_HANG || 0}</div>
        </div>

        <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <span style={{ color: '#8D7B68', fontSize: '0.9rem', fontWeight: 600 }}>Tổng Khách Hàng</span>
            <div style={{ padding: '8px', background: '#E1F5FE', borderRadius: '10px' }}><Users color="#0288D1" size={24} /></div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3C2A21' }}>{overview?.TONG_KHACH_HANG || 0}</div>
        </div>

        <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <span style={{ color: '#8D7B68', fontSize: '0.9rem', fontWeight: 600 }}>Mẫu Bánh Đang Bán</span>
            <div style={{ padding: '8px', background: 'var(--cream-soft)', borderRadius: '10px' }}><Cake color="#D4A373" size={24} /></div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3C2A21' }}>{overview?.TONG_SAN_PHAM || 0}</div>
        </div>
      </div>

      {/* Top Products Table */}
      <div style={{ background: '#FFF', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
        <h2 style={{ fontSize: '1.3rem', color: '#3C2A21', marginBottom: '20px', display: 'flex', itemsAlign: 'center', gap: '8px' }}>
          <TrendingUp color="#D4A373" /> Top 5 Bánh Bán Chạy Nhất
        </h2>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--cream-soft)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '14px' }}>Mã bánh</th>
              <th style={{ padding: '14px' }}>Tên bánh</th>
              <th style={{ padding: '14px' }}>Đã bán (Cái)</th>
              <th style={{ padding: '14px' }}>Doanh thu thu về</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((prod) => (
              <tr key={prod.MASP} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px', fontWeight: 700 }}>{prod.MASP}</td>
                <td style={{ padding: '14px' }}>
                  <div className="flex items-center gap-3">
                    <img src={prod.ANHSP || '/uploads/hinh1.png'} alt={prod.TENSP} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 600 }}>{prod.TENSP}</span>
                  </div>
                </td>
                <td style={{ padding: '14px', fontWeight: 700, color: '#2E7D32' }}>{prod.DA_BAN}</td>
                <td style={{ padding: '14px', fontWeight: 800, color: '#E76F51' }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.DOANH_THU)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

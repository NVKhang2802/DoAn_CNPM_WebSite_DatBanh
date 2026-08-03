import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export const CartPage = () => {
  const { cart, removeItem, addToCart } = useCart();
  const navigate = useNavigate();

  const formattedTotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cart.totalAmount || 0);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '100px', textAlign: 'center' }}>
        <ShoppingBag size={64} color="#D4A373" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: '2rem', color: '#3C2A21', marginBottom: '12px' }}>Giỏ Hàng Của Bạn Đang Trống</h2>
        <p style={{ color: '#8D7B68', marginBottom: '28px' }}>Hãy lựa chọn những chiếc bánh kem thơm ngon vào giỏ hàng nhé!</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Khám Phá Thực Đơn Bánh
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '2.2rem', color: '#3C2A21', marginBottom: '28px' }}>Giỏ Hàng Của Bạn</h1>

      <div className="grid grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--cream-soft)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '16px' }}>Sản phẩm</th>
                  <th style={{ padding: '16px' }}>Đơn giá</th>
                  <th style={{ padding: '16px' }}>Số lượng</th>
                  <th style={{ padding: '16px' }}>Thành tiền</th>
                  <th style={{ padding: '16px', textAlign: 'center' }}>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.MASP} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '16px' }}>
                      <div className="flex items-center gap-3">
                        <img
                          src={item.ANHSP || '/uploads/hinh1.png'}
                          alt={item.TENSP}
                          style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100'; }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#3C2A21' }}>{item.TENSP}</div>
                          <span style={{ fontSize: '0.8rem', color: '#8D7B68' }}>Size {item.KICHCO || 'VỪA'}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600 }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.DONGIA)}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addToCart(item.MASP, -1)}
                          style={{ padding: '4px 10px', background: 'var(--cream-soft)', borderRadius: '6px' }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 700 }}>{item.SOLUONG}</span>
                        <button
                          onClick={() => addToCart(item.MASP, 1)}
                          style={{ padding: '4px 10px', background: 'var(--cream-soft)', borderRadius: '6px' }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 800, color: '#E76F51' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.THANHTIEN)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button onClick={() => removeItem(item.MASP)} style={{ color: '#D32F2F' }} title="Xóa món này">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary Card */}
        <div>
          <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#3C2A21', marginBottom: '20px' }}>Tóm Tắt Đơn Hàng</h3>

            <div className="flex justify-between" style={{ marginBottom: '12px', color: '#5C4A3E' }}>
              <span>Tạm tính ({cart.items.length} món):</span>
              <span style={{ fontWeight: 600 }}>{formattedTotal}</span>
            </div>

            <div className="flex justify-between" style={{ marginBottom: '20px', color: '#5C4A3E' }}>
              <span>Phí giao hàng:</span>
              <span style={{ color: '#2E7D32', fontWeight: 600 }}>Miễn phí (Nội thành)</span>
            </div>

            <div className="flex justify-between" style={{ paddingTop: '16px', borderTop: '2px dashed var(--border-light)', marginBottom: '28px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tổng thanh toán:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#E76F51' }}>{formattedTotal}</span>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn btn-primary btn-lg flex items-center justify-center gap-2" style={{ width: '100%' }}>
              <span>Tiến Hành Thanh Toán</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

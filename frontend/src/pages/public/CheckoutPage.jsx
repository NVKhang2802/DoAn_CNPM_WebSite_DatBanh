import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { orderApi, userApi, voucherApi } from '../../api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, Truck, CreditCard, Banknote, Tag, Sparkles } from 'lucide-react';

export const CheckoutPage = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    diachigiao: '',
    sdtnhan: '',
    phuongthuctt: 'TIỀN MẶT',
    ghichu: '',
    makm: '',
  });

  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [checkingVoucher, setCheckingVoucher] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Auto-fill customer profile details upon mount!
  useEffect(() => {
    userApi.getProfile()
      .then((res) => {
        const p = res.data;
        setForm((prev) => ({
          ...prev,
          sdtnhan: p.SDT || user?.sdt || '',
          diachigiao: p.DIACHI || user?.diachi || '',
        }));
      })
      .catch((err) => console.error('Error auto-filling profile:', err));
  }, [user]);

  const handleApplyVoucher = async (e) => {
    e.preventDefault();
    if (!voucherCodeInput) return;
    setCheckingVoucher(true);
    try {
      const res = await voucherApi.applyVoucher({
        makm: voucherCodeInput,
        tongtien: cart.totalAmount || 0,
      });
      setAppliedVoucher(res.data);
      setForm((prev) => ({ ...prev, makm: res.data.MAKM }));
      showToast(`Áp dụng mã giảm giá ${res.data.MAKM} thành công! Tiết kiệm ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(res.data.TIENGIAM)}`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCheckingVoucher(false);
    }
  };

  const originalTotal = cart.totalAmount || 0;
  const discountAmount = appliedVoucher ? appliedVoucher.TIENGIAM : 0;
  const finalTotal = Math.max(0, originalTotal - discountAmount);

  const formattedOriginalTotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalTotal);
  const formattedDiscount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount);
  const formattedFinalTotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!form.diachigiao || !form.sdtnhan) {
      showToast('Vui lòng điền đầy đủ Địa chỉ giao hàng và Số điện thoại.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await orderApi.createOrder(form);
      setCompletedOrder(res.data);
      await fetchCart();
      showToast('Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '100px', maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ background: '#FFF', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}>
          <CheckCircle2 size={72} color="#2E7D32" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: '2rem', color: '#3C2A21', marginBottom: '12px' }}>Đặt Hàng Thành Công!</h2>
          <p style={{ color: '#5C4A3E', marginBottom: '24px' }}>
            Mã đơn hàng của bạn là <strong style={{ color: '#E76F51' }}>#{completedOrder.MADH}</strong>. Tiệm bánh sẽ liên hệ xác nhận đơn qua sđt ngay.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/profile" className="btn btn-primary">
              Theo Dõi Đơn Hàng Của Tôi
            </Link>
            <Link to="/products" className="btn btn-secondary">
              Tiếp Tục Mua Bánh
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '2.2rem', color: '#3C2A21', marginBottom: '28px' }}>Thanh Toán Đơn Hàng</h1>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-3 gap-8">
        {/* Shipping & Contact Form (Auto-filled from Profile) */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ background: '#FFF', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-light)', marginBottom: '24px' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#3C2A21', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck color="#D4A373" /> Thông Tin Nhận Bánh (Tự động điền từ Hồ Sơ)
              </h3>
              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>✨ Auto-filled Profile</span>
            </div>

            <div className="form-group">
              <label className="form-label">Họ và tên người nhận:</label>
              <input type="text" className="form-input" value={user?.hoten || ''} disabled />
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại nhận bánh *:</label>
              <input
                type="text"
                className="form-input"
                placeholder="Số điện thoại nhận hàng..."
                value={form.sdtnhan}
                onChange={(e) => setForm({ ...form, sdtnhan: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Địa chỉ giao bánh chi tiết *:</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                value={form.diachigiao}
                onChange={(e) => setForm({ ...form, diachigiao: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ghi chú cho tiệm bánh (Nếu có):</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Ví dụ: Ghi chữ 'Happy Birthday' lên nến, giao lúc 15h00..."
                value={form.ghichu}
                onChange={(e) => setForm({ ...form, ghichu: e.target.value })}
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div style={{ background: '#FFF', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#3C2A21', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard color="#D4A373" /> Phương Thức Thanh Toán
            </h3>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3" style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid var(--border-light)', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="phuongthuctt"
                  value="TIỀN MẶT"
                  checked={form.phuongthuctt === 'TIỀN MẶT'}
                  onChange={(e) => setForm({ ...form, phuongthuctt: e.target.value })}
                />
                <Banknote color="#2E7D32" />
                <div>
                  <div style={{ fontWeight: 700 }}>Thanh toán khi nhận hàng (COD)</div>
                  <span style={{ fontSize: '0.85rem', color: '#8D7B68' }}>Thanh toán tiền mặt trực tiếp cho shipper khi nhận bánh</span>
                </div>
              </label>

              <label className="flex items-center gap-3" style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid var(--border-light)', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="phuongthuctt"
                  value="CHUYỂN KHOẢN"
                  checked={form.phuongthuctt === 'CHUYỂN KHOẢN'}
                  onChange={(e) => setForm({ ...form, phuongthuctt: e.target.value })}
                />
                <CreditCard color="#0288D1" />
                <div>
                  <div style={{ fontWeight: 700 }}>Chuyển khoản Ngân hàng / QR Code</div>
                  <span style={{ fontSize: '0.85rem', color: '#8D7B68' }}>Quét mã QR chuyển khoản tự động qua hệ thống ngân hàng</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Voucher Section */}
        <div>
          {/* Voucher Input Card */}
          <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#3C2A21', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag color="#D4A373" size={18} /> Mã Giảm Giá / Voucher
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                className="form-input"
                placeholder="Nhập mã (ví dụ: BANHMOI10)"
                value={voucherCodeInput}
                onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
              />
              <button
                type="button"
                onClick={handleApplyVoucher}
                className="btn btn-secondary btn-sm"
                disabled={checkingVoucher || !voucherCodeInput}
              >
                {checkingVoucher ? 'Đang Lọc...' : 'Áp Dụng'}
              </button>
            </div>

            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#8D7B68' }}>
              Gợi ý mã: <code style={{ color: '#E76F51', fontWeight: 'bold' }}>BANHMOI10</code> (Giảm 10%), <code style={{ color: '#E76F51', fontWeight: 'bold' }}>FREESHIP</code>
            </div>
          </div>

          {/* Checkout Totals Summary */}
          <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#3C2A21', marginBottom: '20px' }}>Tóm Tắt Đơn Hàng</h3>

            <div style={{ marginBottom: '16px' }}>
              {cart.items.map((item) => (
                <div key={item.MASP} className="flex justify-between" style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span>{item.TENSP} x {item.SOLUONG}</span>
                  <span style={{ fontWeight: 700 }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.THANHTIEN)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between" style={{ marginBottom: '8px', color: '#5C4A3E' }}>
              <span>Tạm tính:</span>
              <span style={{ fontWeight: 600 }}>{formattedOriginalTotal}</span>
            </div>

            {appliedVoucher && (
              <div className="flex justify-between" style={{ marginBottom: '8px', color: '#2E7D32', fontWeight: 600 }}>
                <span>Giảm giá ({appliedVoucher.MAKM}):</span>
                <span>-{formattedDiscount}</span>
              </div>
            )}

            <div className="flex justify-between" style={{ paddingTop: '16px', borderTop: '2px dashed var(--border-light)', marginBottom: '24px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tổng thanh toán:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#E76F51' }}>{formattedFinalTotal}</span>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Đang Xử Lý Đơn Hàng...' : 'Xác Nhận Đặt Bánh'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

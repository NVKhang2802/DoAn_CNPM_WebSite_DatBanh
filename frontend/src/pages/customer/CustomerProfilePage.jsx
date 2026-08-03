import React, { useState, useEffect } from 'react';
import { userApi, orderApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { OrderTrackerStepper } from '../../components/ui/OrderTrackerStepper';
import { User, Package, Lock, Save, Eye, XCircle, MapPin, Phone, Mail } from 'lucide-react';

export const CustomerProfilePage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password' | 'orders'

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    hoten: '',
    email: '',
    sdt: '',
    diachi: '',
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password Form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Cancel order modal
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const loadProfile = async () => {
    try {
      const res = await userApi.getProfile();
      const p = res.data;
      setProfileForm({
        hoten: p.HOTEN || '',
        email: p.EMAIL || '',
        sdt: p.SDT || '',
        diachi: p.DIACHI || '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await orderApi.getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadOrders();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await userApi.updateProfile(profileForm);
      showToast('Cập nhật thông tin cá nhân và địa chỉ mặc định thành công!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Mật khẩu mới và Nhập lại mật khẩu không khớp!', 'error');
      return;
    }
    setChangingPassword(true);
    try {
      await userApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      showToast('Đổi mật khẩu thành công!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleConfirmCancelOrder = async () => {
    if (!cancelModalOrder) return;
    try {
      await orderApi.cancelOrder(cancelModalOrder.MADH, cancelReason);
      showToast(`Đã hủy đơn hàng #${cancelModalOrder.MADH} thành công`);
      setCancelModalOrder(null);
      setCancelReason('');
      loadOrders();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleViewOrderDetail = async (madh) => {
    try {
      const res = await orderApi.getOrderDetail(madh);
      setSelectedOrder(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* User Info Header Banner */}
      <div style={{ background: '#FFF', padding: '32px', borderRadius: '20px', border: '1px solid var(--border-light)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--cream-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={40} color="#D4A373" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#3C2A21' }}>{profileForm.hoten || user?.hoten}</h1>
          <p style={{ color: '#8D7B68' }}>Tài khoản Thành viên | Tên đăng nhập: <strong>@{user?.tendn}</strong></p>
        </div>
      </div>

      {/* Tabs Navigation Header */}
      <div className="flex gap-3" style={{ marginBottom: '24px' }}>
        <button
          className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} />
          <span>Hồ Sơ & Địa Chỉ Mặc Định</span>
        </button>

        <button
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('orders')}
        >
          <Package size={18} />
          <span>Lịch Sử & Đơn Hàng ({orders.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'password' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('password')}
        >
          <Lock size={18} />
          <span>Đổi Mật Khẩu</span>
        </button>
      </div>

      {/* TAB 1: PROFILE EDIT FORM */}
      {activeTab === 'profile' && (
        <div style={{ background: '#FFF', padding: '32px', borderRadius: '20px', border: '1px solid var(--border-light)', maxWidth: '640px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#3C2A21', marginBottom: '24px' }}>Chỉnh Sửa Hồ Sơ Cá Nhân</h2>
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label">Họ và tên *:</label>
              <input
                type="text"
                className="form-input"
                value={profileForm.hoten}
                onChange={(e) => setProfileForm({ ...profileForm, hoten: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Địa chỉ Email *:</label>
              <input
                type="email"
                className="form-input"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại mặc định *:</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nhập SĐT mặc định để nhận bánh"
                value={profileForm.sdt}
                onChange={(e) => setProfileForm({ ...profileForm, sdt: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Địa chỉ giao bánh mặc định *:</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                value={profileForm.diachi}
                onChange={(e) => setProfileForm({ ...profileForm, diachi: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg flex items-center gap-2" style={{ width: 'fit-content' }} disabled={updatingProfile}>
              <Save size={18} />
              <span>{updatingProfile ? 'Đang Lưu...' : 'Lưu Thay Đổi Hồ Sơ'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: CHANGE PASSWORD */}
      {activeTab === 'password' && (
        <div style={{ background: '#FFF', padding: '32px', borderRadius: '20px', border: '1px solid var(--border-light)', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#3C2A21', marginBottom: '24px' }}>Đổi Mật Khẩu Tài Khoản</h2>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label">Mật khẩu hiện tại:</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu mới (tối thiểu 6 ký tự):</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nhập lại mật khẩu mới:</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg flex items-center gap-2" style={{ width: 'fit-content' }} disabled={changingPassword}>
              <Lock size={18} />
              <span>{changingPassword ? 'Đang Cập Nhật...' : 'Cập Nhật Mật Khẩu'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: ORDERS HISTORY & STEPPER TRACKER */}
      {activeTab === 'orders' && (
        <div style={{ background: '#FFF', padding: '32px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#3C2A21', marginBottom: '24px' }}>Lịch Sử Đơn Hàng Của Bạn</h2>

          {loadingOrders ? (
            <div>Đang tải danh sách đơn hàng...</div>
          ) : orders.length === 0 ? (
            <p style={{ color: '#8D7B68' }}>Bạn chưa có đơn hàng nào.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map((ord) => (
                <div key={ord.MADH} style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', background: 'var(--bg-surface-elevated)' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#E76F51' }}>Đơn hàng #{ord.MADH}</span>
                      <span style={{ marginLeft: '12px', fontSize: '0.85rem', color: '#8D7B68' }}>
                        {new Date(ord.NGAYDAT).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`badge ${
                        ord.TRANGTHAI === 'HOÀN THÀNH' ? 'badge-success' :
                        ord.TRANGTHAI === 'ĐÃ HỦY' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {ord.TRANGTHAI}
                      </span>

                      {ord.TRANGTHAI === 'ĐANG XỬ LÝ' && (
                        <button
                          onClick={() => setCancelModalOrder(ord)}
                          className="btn btn-danger btn-sm"
                        >
                          Hủy Đơn Hàng
                        </button>
                      )}

                      <button onClick={() => handleViewOrderDetail(ord.MADH)} className="btn btn-secondary btn-sm flex items-center gap-1">
                        <Eye size={16} /> Chi tiết
                      </button>
                    </div>
                  </div>

                  {/* Stepper Timeline Tracker */}
                  <OrderTrackerStepper status={ord.TRANGTHAI} />

                  <div className="flex justify-between items-center" style={{ paddingTop: '12px', borderTop: '1px dashed var(--border-light)', fontSize: '0.95rem' }}>
                    <div><strong>Địa chỉ giao:</strong> {ord.DIACHIGIAO}</div>
                    <div>
                      <strong>Tổng thanh toán:</strong>{' '}
                      <span style={{ fontWeight: 800, color: '#E76F51', fontSize: '1.1rem' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ord.TONGTIEN)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cancel Order Confirm Modal */}
      {cancelModalOrder && (
        <div className="modal-overlay" onClick={() => setCancelModalOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <h3 style={{ color: '#D32F2F', marginBottom: '12px' }}>Xác Nhận Hủy Đơn Hàng #{cancelModalOrder.MADH}</h3>
            <p style={{ color: '#5C4A3E', marginBottom: '16px' }}>Bạn có chắc chắn muốn hủy đơn hàng này? Tồn kho bánh sẽ được hoàn trả lại cho cửa hàng.</p>
            
            <div className="form-group">
              <label className="form-label">Lý do hủy đơn (không bắt buộc):</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ví dụ: Đổi ý chọn bánh khác, bận việc đột xuất..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>

            <div className="flex gap-3 justify-end" style={{ marginTop: '20px' }}>
              <button onClick={() => setCancelModalOrder(null)} className="btn btn-secondary">Quay Lại</button>
              <button onClick={handleConfirmCancelOrder} className="btn btn-danger">Xác Nhận Hủy Đơn</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', color: '#3C2A21' }}>Chi Tiết Đơn Hàng #{selectedOrder.order.MADH}</h3>
            <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.order.NGAYDAT).toLocaleString('vi-VN')}</p>
            <p><strong>Địa chỉ giao:</strong> {selectedOrder.order.DIACHIGIAO}</p>
            <p><strong>SĐT nhận:</strong> {selectedOrder.order.SDTNHAN}</p>
            {selectedOrder.order.TIENGIAM > 0 && (
              <p style={{ color: '#2E7D32' }}><strong>Mã giảm giá ({selectedOrder.order.MAKM}):</strong> -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.order.TIENGIAM)}</p>
            )}

            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Chi tiết danh sách bánh:</h4>
            <div className="flex flex-col gap-2" style={{ marginBottom: '20px' }}>
              {selectedOrder.items.map((item) => (
                <div key={item.MASP} className="flex justify-between items-center" style={{ padding: '8px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                  <span>{item.TENSP} (Size {item.KICHCO}) x {item.SOLUONG}</span>
                  <span style={{ fontWeight: 700 }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.THANHTIEN)}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={() => setSelectedOrder(null)} className="btn btn-secondary" style={{ width: '100%' }}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { orderApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { PackageCheck, Eye } from 'lucide-react';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showToast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (madh, newStatus) => {
    try {
      await orderApi.updateStatus(madh, newStatus);
      showToast(`Đã chuyển đơn hàng #${madh} sang '${newStatus}'`);
      loadOrders();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleViewDetail = async (madh) => {
    try {
      const res = await orderApi.getOrderDetail(madh);
      setSelectedOrder(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: '#3C2A21', marginBottom: '24px' }}>Quản Lý Đơn Hàng</h1>

      <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
        {loading ? (
          <div>Đang tải danh sách đơn hàng...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--cream-soft)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px' }}>Mã đơn</th>
                <th style={{ padding: '14px' }}>Khách hàng</th>
                <th style={{ padding: '14px' }}>Ngày đặt</th>
                <th style={{ padding: '14px' }}>Tổng tiền</th>
                <th style={{ padding: '14px' }}>Thanh toán</th>
                <th style={{ padding: '14px' }}>Trạng thái đơn</th>
                <th style={{ padding: '14px', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.MADH} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px', fontWeight: 700, color: '#E76F51' }}>#{ord.MADH}</td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 600 }}>{ord.TENKHACHHANG}</div>
                    <span style={{ fontSize: '0.8rem', color: '#8D7B68' }}>{ord.SDT}</span>
                  </td>
                  <td style={{ padding: '14px' }}>{new Date(ord.NGAYDAT).toLocaleDateString('vi-VN')}</td>
                  <td style={{ padding: '14px', fontWeight: 700 }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ord.TONGTIEN)}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge ${ord.TRANGTHAI_TT === 'ĐÃ THANH TOÁN' ? 'badge-success' : 'badge-warning'}`}>
                      {ord.TRANGTHAI_TT || 'CHƯA THANH TOÁN'}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <select
                      className="form-input"
                      style={{ width: '160px', padding: '6px 10px', fontSize: '0.85rem' }}
                      value={ord.TRANGTHAI}
                      onChange={(e) => handleStatusChange(ord.MADH, e.target.value)}
                      disabled={ord.TRANGTHAI === 'HOÀN THÀNH' || ord.TRANGTHAI === 'ĐÃ HỦY'}
                    >
                      <option value="ĐANG XỬ LÝ">ĐANG XỬ LÝ</option>
                      <option value="ĐÃ DUYỆT">ĐÃ DUYỆT</option>
                      <option value="ĐANG GIAO HÀNG">ĐANG GIAO HÀNG</option>
                      <option value="HOÀN THÀNH">HOÀN THÀNH</option>
                      <option value="ĐÃ HỦY">ĐÃ HỦY</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <button onClick={() => handleViewDetail(ord.MADH)} className="btn btn-secondary btn-sm">
                      <Eye size={16} /> Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Detail */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', color: '#3C2A21' }}>Chi Tiết Đơn Hàng #{selectedOrder.order.MADH}</h3>
            
            <p><strong>Khách hàng:</strong> {selectedOrder.order.TENKHACHHANG} ({selectedOrder.order.EMAIL})</p>
            <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.order.NGAYDAT).toLocaleString('vi-VN')}</p>
            <p><strong>Địa chỉ giao:</strong> {selectedOrder.order.DIACHIGIAO}</p>
            <p><strong>SĐT nhận:</strong> {selectedOrder.order.SDTNHAN}</p>
            <p><strong>Phương thức TT:</strong> {selectedOrder.order.PHUONGTHUC}</p>

            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Chi tiết món bánh:</h4>
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

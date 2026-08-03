import React, { useState, useEffect } from 'react';
import { productApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit, Cake } from 'lucide-react';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState(null);

  const [form, setForm] = useState({
    tensp: '',
    gia: '',
    mota: '',
    kichco: 'VỪA',
    mausac: 'TỰ NHIÊN',
    trangthai: 'CÒN HÀNG',
    soluongton: 50,
    image: null,
  });

  const { showToast } = useToast();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productApi.getProducts({ limit: 100 });
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProd(null);
    setForm({
      tensp: '',
      gia: '',
      mota: '',
      kichco: 'VỪA',
      mausac: 'TỰ NHIÊN',
      trangthai: 'CÒN HÀNG',
      soluongton: 50,
      image: null,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProd(prod);
    setForm({
      tensp: prod.TENSP,
      gia: prod.GIA,
      mota: prod.MOTA,
      kichco: prod.KICHCO || 'VỪA',
      mausac: prod.MAUSAC || 'TỰ NHIÊN',
      trangthai: prod.TRANGTHAI || 'CÒN HÀNG',
      soluongton: prod.SOLUONGTON || 50,
      image: null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (editingProd) formData.append('masp', editingProd.MASP);
    formData.append('tensp', form.tensp);
    formData.append('gia', form.gia);
    formData.append('mota', form.mota);
    formData.append('kichco', form.kichco);
    formData.append('mausac', form.mausac);
    formData.append('trangthai', form.trangthai);
    formData.append('soluongton', form.soluongton);
    if (form.image) formData.append('image', form.image);

    try {
      await productApi.upsertProduct(formData);
      showToast(editingProd ? 'Cập nhật bánh thành công!' : 'Thêm mới bánh thành công!');
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', color: '#3C2A21' }}>Quản Lý Mẫu Bánh</h1>
        <button onClick={handleOpenAdd} className="btn btn-primary flex items-center gap-2">
          <Plus size={20} /> Thêm Bánh Mới
        </button>
      </div>

      <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
        {loading ? (
          <div>Đang tải danh sách bánh...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--cream-soft)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px' }}>Mã bánh</th>
                <th style={{ padding: '14px' }}>Tên bánh</th>
                <th style={{ padding: '14px' }}>Giá bán</th>
                <th style={{ padding: '14px' }}>Tồn kho</th>
                <th style={{ padding: '14px' }}>Trạng thái</th>
                <th style={{ padding: '14px', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.MASP} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px', fontWeight: 700 }}>{p.MASP}</td>
                  <td style={{ padding: '14px' }}>
                    <div className="flex items-center gap-3">
                      <img src={p.ANHSP || '/uploads/hinh1.png'} alt={p.TENSP} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                      <span style={{ fontWeight: 600 }}>{p.TENSP}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 700, color: '#E76F51' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.GIA)}
                  </td>
                  <td style={{ padding: '14px', fontWeight: 700 }}>{p.SOLUONGTON}</td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge ${p.TRANGTHAI === 'CÒN HÀNG' ? 'badge-success' : 'badge-danger'}`}>
                      {p.TRANGTHAI}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <button onClick={() => handleOpenEdit(p)} className="btn btn-secondary btn-sm">
                      <Edit size={16} /> Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Product Upsert Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <h3 style={{ marginBottom: '20px', color: '#3C2A21' }}>
              {editingProd ? `Cập nhật Bánh ${editingProd.MASP}` : 'Thêm Mới Bánh Tươi'}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Tên bánh *:</label>
                <input type="text" className="form-input" value={form.tensp} onChange={(e) => setForm({ ...form, tensp: e.target.value })} required />
              </div>

              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Giá bán (VND) *:</label>
                  <input type="number" className="form-input" value={form.gia} onChange={(e) => setForm({ ...form, gia: e.target.value })} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Số lượng tồn *:</label>
                  <input type="number" className="form-input" value={form.soluongton} onChange={(e) => setForm({ ...form, soluongton: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả sản phẩm bánh:</label>
                <textarea className="form-input" rows={3} value={form.mota} onChange={(e) => setForm({ ...form, mota: e.target.value })} />
              </div>

              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Kích thước:</label>
                  <select className="form-input" value={form.kichco} onChange={(e) => setForm({ ...form, kichco: e.target.value })}>
                    <option value="NHỎ">NHỎ (16cm)</option>
                    <option value="VỪA">VỪA (20cm)</option>
                    <option value="LỚN">LỚN (24cm)</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Trạng thái:</label>
                  <select className="form-input" value={form.trangthai} onChange={(e) => setForm({ ...form, trangthai: e.target.value })}>
                    <option value="CÒN HÀNG">CÒN HÀNG</option>
                    <option value="HẾT HÀNG">HẾT HÀNG</option>
                    <option value="NGỪNG BÁN">NGỪNG BÁN</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tải lên hình ảnh mới:</label>
                <input type="file" className="form-input" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
              </div>

              <div className="flex gap-3 justify-end" style={{ marginTop: '12px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Sản Phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

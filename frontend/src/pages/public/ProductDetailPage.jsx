import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi, reviewApi } from '../../api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { RatingStars } from '../../components/common/RatingStars';
import { ShoppingBag, ArrowLeft, Star, MessageSquare } from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState('VỪA');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Write Review state
  const [reviewForm, setReviewForm] = useState({ sosao: 5, binhluan: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, revRes] = await Promise.all([
        productApi.getProductDetail(id),
        reviewApi.getProductReviews(id),
      ]);
      setProduct(prodRes.data);
      if (prodRes.data?.KICHCO) setSelectedSize(prodRes.data.KICHCO);
      setReviews(revRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Vui lòng đăng nhập để gửi đánh giá.', 'error');
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewApi.addReview({
        masp: id,
        sosao: reviewForm.sosao,
        binhluan: reviewForm.binhluan,
      });
      showToast('Cảm ơn bạn đã gửi đánh giá!');
      setReviewForm({ sosao: 5, binhluan: '' });
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}>Đang tải thông tin bánh...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '80px' }}>Không tìm thấy sản phẩm.</div>;

  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GIA);

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <Link to="/products" className="btn btn-secondary btn-sm flex items-center gap-2" style={{ marginBottom: '24px', width: 'fit-content' }}>
        <ArrowLeft size={16} /> Quay lại thực đơn
      </Link>

      <div className="grid grid-cols-2 gap-8" style={{ background: '#FFF', padding: '32px', borderRadius: '20px', border: '1px solid var(--border-light)', marginBottom: '40px' }}>
        {/* Product Image */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', background: 'var(--cream-soft)' }}>
          <img
            src={product.ANHSP || '/uploads/hinh1.png'}
            alt={product.TENSP}
            style={{ width: '100%', height: '420px', objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'; }}
          />
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col">
          <span className="badge badge-warning" style={{ width: 'fit-content', marginBottom: '12px' }}>
            {product.TENDM || 'Bánh Kem Tươi'}
          </span>
          <h1 style={{ fontSize: '2.2rem', color: '#3C2A21', marginBottom: '12px' }}>{product.TENSP}</h1>

          <div className="flex items-center gap-4" style={{ marginBottom: '20px' }}>
            <RatingStars rating={product.DIEM_DANHGIA || 5} count={product.SO_LUOT_DANHGIA} />
            <span style={{ color: '#8D7B68' }}>|</span>
            <span style={{ fontSize: '0.9rem', color: product.TRANGTHAI === 'CÒN HÀNG' ? '#2E7D32' : '#D32F2F', fontWeight: 600 }}>
              {product.TRANGTHAI} (Tồn: {product.SOLUONGTON})
            </span>
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#E76F51', marginBottom: '24px' }}>
            {formattedPrice}
          </div>

          <p style={{ color: '#5C4A3E', lineHeight: '1.7', marginBottom: '28px' }}>
            {product.MOTA}
          </p>

          {/* Size selection */}
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Kích Thước Bánh:</label>
            <div className="flex gap-3">
              {['NHỎ (16cm)', 'VỪA (20cm)', 'LỚN (24cm)'].map((sizeOpt) => {
                const sizeVal = sizeOpt.split(' ')[0];
                return (
                  <button
                    key={sizeOpt}
                    type="button"
                    className={`btn btn-sm ${selectedSize === sizeVal ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedSize(sizeVal)}
                  >
                    {sizeOpt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="flex gap-4 items-center" style={{ marginTop: 'auto' }}>
            <div className="flex items-center" style={{ border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '10px 16px', background: 'var(--cream-soft)', fontWeight: 'bold' }}
              >
                -
              </button>
              <span style={{ padding: '10px 20px', fontWeight: 700 }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '10px 16px', background: 'var(--cream-soft)', fontWeight: 'bold' }}
              >
                +
              </button>
            </div>

            <button
              onClick={() => addToCart(product.MASP, quantity, selectedSize)}
              className="btn btn-primary btn-lg flex-1 flex items-center justify-center gap-2"
              disabled={product.TRANGTHAI !== 'CÒN HÀNG'}
            >
              <ShoppingBag size={20} />
              <span>Thêm Vào Giỏ Hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div style={{ background: '#FFF', padding: '32px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#3C2A21', marginBottom: '24px' }}>Đánh Giá Từ Khách Hàng ({reviews.length})</h3>

        {/* Add Review Form */}
        <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: '14px', marginBottom: '32px' }}>
          <h4 style={{ marginBottom: '12px' }}>Viết đánh giá của bạn</h4>
          <form onSubmit={handleAddReview} className="flex flex-col gap-4">
            <div>
              <label className="form-label">Chọn số sao:</label>
              <select
                className="form-input"
                style={{ width: '160px' }}
                value={reviewForm.sosao}
                onChange={(e) => setReviewForm({ ...reviewForm, sosao: Number(e.target.value) })}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 sao - Rất tốt)</option>
                <option value={4}>⭐⭐⭐⭐ (4 sao - Good)</option>
                <option value={3}>⭐⭐⭐ (3 sao - Bình thường)</option>
                <option value={2}>⭐⭐ (2 sao - Tạm được)</option>
                <option value={1}>⭐ (1 sao - Kém)</option>
              </select>
            </div>

            <div>
              <textarea
                placeholder="Nhận xét cảm nhận của bạn về hương vị bánh, chất lượng giao hàng..."
                className="form-input"
                rows={3}
                value={reviewForm.binhluan}
                onChange={(e) => setReviewForm({ ...reviewForm, binhluan: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm" style={{ width: 'fit-content' }} disabled={submittingReview}>
              Gửi Đánh Giá
            </button>
          </form>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p style={{ color: '#8D7B68' }}>Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((rev) => (
              <div key={rev.MADG} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, color: '#3C2A21' }}>{rev.TENKHACHHANG}</span>
                  <span style={{ fontSize: '0.8rem', color: '#8D7B68' }}>{new Date(rev.NGAYDG).toLocaleDateString('vi-VN')}</span>
                </div>
                <RatingStars rating={rev.SOSAO} />
                <p style={{ marginTop: '8px', color: '#5C4A3E' }}>{rev.BINHLUAN}</p>

                {/* Admin Reply */}
                {rev.PHANHOI && (
                  <div style={{ marginTop: '12px', padding: '12px', background: 'var(--cream-soft)', borderRadius: '8px', borderLeft: '4px solid var(--rose-gold)' }}>
                    <span style={{ fontWeight: 700, color: '#3C2A21', fontSize: '0.85rem' }}>💬 Phản hồi từ Tiệm Bánh Artisan:</span>
                    <p style={{ fontSize: '0.9rem', color: '#5C4A3E', marginTop: '4px' }}>{rev.PHANHOI}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

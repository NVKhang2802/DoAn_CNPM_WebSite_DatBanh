import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api';
import { CakeCard } from '../../components/ui/CakeCard';
import { Sparkles, ShieldCheck, Truck, Heart, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi.getProducts({ limit: 8, sort: 'MOI_NHAT' })
      .then((res) => setFeaturedCakes(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #FFFDF9 0%, #F5EBE0 100%)', padding: '80px 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container grid grid-cols-2 items-center gap-8">
          <div>
            <span className="badge badge-warning" style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
              ✨ Tiệm Bánh Artisan Chuẩn Pháp
            </span>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#3C2A21', lineHeight: '1.15', marginBottom: '20px' }}>
              Hương Vị Tròn Vẹn Cho Mọi Khoảnh Khắc Ngọt Ngào
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#5C4A3E', marginBottom: '32px', lineHeight: '1.7' }}>
              Tất cả các dòng bánh kem tươi tại Cake Artisan đều được nướng mới mỗi ngày từ kem bơ động vật nguyên chất, socola Bỉ đắng thơm và dâu tây tươi mọng nước.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="btn btn-primary btn-lg flex items-center gap-2">
                <span>Khám Phá Thực Đơn</span>
                <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg">
                Về Chúng Tôi
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative', textAlign: 'center' }}>
            <img
              src="/uploads/hinh1.png"
              alt="Cake Hero"
              style={{ width: '100%', maxWidth: '480px', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', border: '6px solid #FFF' }}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'; }}
            />
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section style={{ padding: '50px 0', background: '#FFF' }}>
        <div className="container grid grid-cols-3 gap-6 text-center">
          <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '16px' }}>
            <Sparkles size={36} color="#D4A373" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ marginBottom: '8px' }}>Tươi Mới Mỗi Ngày</h3>
            <p style={{ color: '#8D7B68', fontSize: '0.9rem' }}>Bánh chỉ được nướng sau khi chốt đơn, giữ nguyên độ mềm mịn thơm lừng.</p>
          </div>

          <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '16px' }}>
            <ShieldCheck size={36} color="#D4A373" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ marginBottom: '8px' }}>Nguyên Liệu Thượng Hạng</h3>
            <p style={{ color: '#8D7B68', fontSize: '0.9rem' }}>100% kem tươi nhập khẩu, không chất bảo quản, độ ngọt thanh mát.</p>
          </div>

          <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '16px' }}>
            <Truck size={36} color="#D4A373" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ marginBottom: '8px' }}>Giao Hàng Hỏa Tốc</h3>
            <p style={{ color: '#8D7B68', fontSize: '0.9rem' }}>Thùng giữ nhiệt chuyên dụng đảm bảo bánh luôn nguyên vẹn khi tới tay.</p>
          </div>
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div className="flex items-center justify-between" style={{ marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '2.2rem', color: '#3C2A21' }}>Mẫu Bánh Nổi Bật</h2>
              <p style={{ color: '#8D7B68' }}>Những tuyệt phẩm bánh kem tươi được khách hàng yêu thích nhất</p>
            </div>
            <Link to="/products" className="btn btn-outline flex items-center gap-2">
              <span>Xem Tất Cả</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải danh sách bánh tươi...</div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {featuredCakes.map((cake) => (
                <CakeCard key={cake.MASP} cake={cake} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { productApi } from '../../api';
import { CakeCard } from '../../components/ui/CakeCard';
import { Search, Filter, RefreshCw } from 'lucide-react';

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tukhoa: '',
    madm: '',
    gia_tu: '',
    gia_den: '',
    sort: 'MOI_NHAT',
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productApi.getProducts(filters);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters.madm, filters.sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleReset = () => {
    setFilters({
      tukhoa: '',
      madm: '',
      gia_tu: '',
      gia_den: '',
      sort: 'MOI_NHAT',
    });
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#3C2A21', marginBottom: '8px' }}>Thực Đơn Bánh Tươi</h1>
        <p style={{ color: '#8D7B68' }}>Khám phá bộ sưu tập bánh ngọt thượng hạng nướng mới mỗi ngày</p>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ background: '#FFF', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)', marginBottom: '32px', boxShadow: 'var(--shadow-sm)' }}>
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4 flex-wrap">
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Tìm tên bánh hoặc hương vị (ví dụ: Socola, Dâu, Tiramisu...)"
                className="form-input"
                style={{ paddingLeft: '42px' }}
                value={filters.tukhoa}
                onChange={(e) => setFilters({ ...filters, tukhoa: e.target.value })}
              />
              <Search size={20} color="#8D7B68" style={{ position: 'absolute', left: '14px', top: '12px' }} />
            </div>

            <select
              className="form-input"
              style={{ width: '200px' }}
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="MOI_NHAT">Mới nhất</option>
              <option value="GIA_ASC">Giá tăng dần</option>
              <option value="GIA_DESC">Giá giảm dần</option>
            </select>

            <button type="submit" className="btn btn-primary">
              <Search size={18} />
              <span>Tìm kiếm</span>
            </button>

            <button type="button" onClick={handleReset} className="btn btn-secondary" title="Đặt lại bộ lọc">
              <RefreshCw size={18} />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap" style={{ paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
            <button
              type="button"
              className={`btn btn-sm ${filters.madm === '' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilters({ ...filters, madm: '' })}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filters.madm === 'DM01' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilters({ ...filters, madm: 'DM01' })}
            >
              🍫 Bánh Kem Socola
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filters.madm === 'DM02' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilters({ ...filters, madm: 'DM02' })}
            >
              🍓 Trái Cây & Mousse
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filters.madm === 'DM03' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilters({ ...filters, madm: 'DM03' })}
            >
              ☕ Tiramisu & Cheesecake
            </button>
          </div>
        </form>
      </div>

      {/* Product List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Đang tải danh sách sản phẩm...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#FFF', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <h3>Không tìm thấy sản phẩm phù hợp</h3>
          <p style={{ color: '#8D7B68', marginTop: '8px' }}>Vui lòng thử tìm kiếm với từ khóa khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {products.map((cake) => (
            <CakeCard key={cake.MASP} cake={cake} />
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Cake, Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: '#2B1E16', color: '#FAF6F0', paddingTop: '60px', paddingBottom: '30px', marginTop: '80px' }}>
      <div className="container grid grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: '16px', fontSize: '1.4rem', fontWeight: 800 }}>
            <Cake size={28} color="#D4A373" />
            <span style={{ color: '#FFF' }}>Cake Artisan</span>
          </div>
          <p style={{ color: '#A09080', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Tiệm bánh tươi cao cấp hàng đầu. Chúng tôi tỉ mỉ tạo nên những mẻ bánh ngon lành, đẹp mắt và an toàn cho sức khỏe từ những nguyên liệu chuẩn Pháp.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#E0A96D', marginBottom: '16px' }}>Danh Mục Bánh</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#C5B5A5' }}>
            <li>Bánh Kem Socola Bỉ</li>
            <li>Bánh Trái Cây & Mousse</li>
            <li>Bánh Tiramisu Ý & Cheesecake</li>
            <li>Bánh Cưới Hoàng Gia</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#E0A96D', marginBottom: '16px' }}>Liên Hệ</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#C5B5A5' }}>
            <li className="flex items-center gap-2"><MapPin size={16} color="#D4A373" /> 123 Nguyễn Trãi, Thanh Xuân, Hà Nội</li>
            <li className="flex items-center gap-2"><Phone size={16} color="#D4A373" /> 0911 111 111 / 0922 222 222</li>
            <li className="flex items-center gap-2"><Mail size={16} color="#D4A373" /> lienhe@cakeartisan.com</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#E0A96D', marginBottom: '16px' }}>Giờ Mở Cửa</h4>
          <p style={{ color: '#C5B5A5', fontSize: '0.9rem' }}>Thứ Hai - Chủ Nhật: 08:00 - 22:00</p>
          <p style={{ color: '#A09080', fontSize: '0.85rem', marginTop: '8px' }}>Giao hàng hỏa tốc trong 2 giờ tại nội thành.</p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '40px', paddingTop: '20px', textAlign: 'center', color: '#8D7B68', fontSize: '0.85rem' }}>
        © 2026 Cake Artisan Bakery. All rights reserved. Enterprise Architecture ReactJS + Node.js + SQL Server.
      </div>
    </footer>
  );
};

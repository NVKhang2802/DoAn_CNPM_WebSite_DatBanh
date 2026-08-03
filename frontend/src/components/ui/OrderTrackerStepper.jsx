import React from 'react';
import { Clock, CheckCircle2, Truck, Star, XCircle } from 'lucide-react';

export const OrderTrackerStepper = ({ status }) => {
  if (status === 'ĐÃ HỦY') {
    return (
      <div style={{ padding: '16px', background: '#FFEBEE', borderRadius: '12px', color: '#D32F2F', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
        <XCircle size={24} />
        <span>Đơn hàng này đã bị hủy. Tồn kho sản phẩm đã được hoàn trả tự động.</span>
      </div>
    );
  }

  const steps = [
    { key: 'ĐANG XỬ LÝ', label: 'Đang Xử Lý', icon: <Clock size={18} /> },
    { key: 'ĐÃ DUYỆT', label: 'Đã Duyệt Bánh', icon: <CheckCircle2 size={18} /> },
    { key: 'ĐANG GIAO HÀNG', label: 'Đang Giao', icon: <Truck size={18} /> },
    { key: 'HOÀN THÀNH', label: 'Hoàn Thành', icon: <Star size={18} /> },
  ];

  const getStepIndex = (st) => {
    switch (st) {
      case 'ĐANG XỬ LÝ': return 0;
      case 'ĐÃ DUYỆT': return 1;
      case 'ĐANG GIAO HÀNG': return 2;
      case 'HOÀN THÀNH': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div style={{ padding: '20px 10px', background: 'var(--bg-primary)', borderRadius: '16px', marginBottom: '24px' }}>
      <div className="flex justify-between items-center" style={{ position: 'relative' }}>
        {/* Connection Line */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '10%',
            right: '10%',
            height: '4px',
            background: 'var(--border-light)',
            zIndex: 1,
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #D4A373, #E76F51)',
              width: `${(currentIndex / (steps.length - 1)) * 100}%`,
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const isPassed = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center" style={{ zIndex: 2, flex: 1 }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isPassed ? '#E76F51' : '#FFF',
                  color: isPassed ? '#FFF' : '#8D7B68',
                  border: `2px solid ${isPassed ? '#E76F51' : 'var(--border-light)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  boxShadow: isCurrent ? 'var(--shadow-glow)' : 'none',
                  transition: '0.3s ease',
                }}
              >
                {step.icon}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#3C2A21' : '#8D7B68' }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

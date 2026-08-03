import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export const AdminLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getLoginLogs()
      .then((res) => setLogs(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: '#3C2A21', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ShieldAlert color="#D32F2F" /> Nhật Ký Bảo Mật & Lịch Sử Đăng Nhập
      </h1>

      <div style={{ background: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
        {loading ? (
          <div>Đang tải nhật ký đăng nhập...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--cream-soft)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px' }}>STT</th>
                <th style={{ padding: '14px' }}>Tên đăng nhập</th>
                <th style={{ padding: '14px' }}>Thời gian</th>
                <th style={{ padding: '14px' }}>Địa chỉ IP</th>
                <th style={{ padding: '14px' }}>Kết quả xác thực</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.MA} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px', fontWeight: 700 }}>#{log.MA}</td>
                  <td style={{ padding: '14px', fontWeight: 600, color: '#3C2A21' }}>{log.TENDN}</td>
                  <td style={{ padding: '14px' }}>{new Date(log.THOIGIAN).toLocaleString('vi-VN')}</td>
                  <td style={{ padding: '14px', fontFamily: 'monospace' }}>{log.IPADDRESS}</td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge ${
                      log.KETQUA.includes('THÀNH CÔNG') ? 'badge-success' : 'badge-danger'
                    }`}>
                      {log.KETQUA}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

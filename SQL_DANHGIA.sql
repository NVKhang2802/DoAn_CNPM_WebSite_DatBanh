-- ==============================================
-- SCRIPT TẠO BẢNG ĐÁNH GIÁ SẢN PHẨM
-- Chạy script này sau khi đã có database QL_BANH
-- ==============================================

USE QL_BANH;
GO

-- Xóa bảng nếu đã tồn tại (cẩn thận khi chạy script này)
-- DROP TABLE IF EXISTS DANHGIA;
-- GO

-- BẢNG ĐÁNH GIÁ SẢN PHẨM
CREATE TABLE DANHGIA (
    MADG NVARCHAR(10) NOT NULL,
    MASP NVARCHAR(10) NOT NULL,
    MAKH NVARCHAR(10) NOT NULL,
    SOSAO INT NOT NULL,
    BINHLUAN NVARCHAR(500),
    NGAYDG DATETIME DEFAULT GETDATE(),
    PHANHOI NVARCHAR(500),           -- Phản hồi của Admin
    NGAYPHANHOI DATETIME,            -- Ngày phản hồi
    CONSTRAINT PK_DANHGIA PRIMARY KEY (MADG),
    CONSTRAINT FK_DANHGIA_SANPHAM FOREIGN KEY (MASP) REFERENCES SANPHAM(MASP),
    CONSTRAINT FK_DANHGIA_KHACHHANG FOREIGN KEY (MAKH) REFERENCES KHACHHANG(MAKH),
    CONSTRAINT CHK_DANHGIA_SOSAO CHECK (SOSAO BETWEEN 1 AND 5)
)
GO

-- Nếu bảng đã tồn tại, thêm 2 cột mới bằng lệnh ALTER:
-- ALTER TABLE DANHGIA ADD PHANHOI NVARCHAR(500);
-- ALTER TABLE DANHGIA ADD NGAYPHANHOI DATETIME;
-- GO

-- Dữ liệu mẫu cho bảng DANHGIA
INSERT INTO DANHGIA (MADG, MASP, MAKH, SOSAO, BINHLUAN, NGAYDG) VALUES
('DG01', 'SP01', 'KH01', 5, N'Bánh rất ngon, gia đình tôi rất thích!', '2025-11-01'),
('DG02', 'SP01', 'KH02', 4, N'Chất lượng tốt, giao hàng nhanh', '2025-11-02'),
('DG03', 'SP02', 'KH03', 5, N'Tuyệt vời! Sẽ quay lại mua', '2025-11-03'),
('DG04', 'SP03', 'KH04', 3, N'Bánh ngon nhưng hơi ngọt', '2025-11-05'),
('DG05', 'SP04', 'KH05', 4, N'Đẹp và ngon', '2025-11-10')
GO

-- Kiểm tra dữ liệu
SELECT * FROM DANHGIA;
GO

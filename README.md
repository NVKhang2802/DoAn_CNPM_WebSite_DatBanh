# Cake Ordering Website - Enterprise Fullstack Application

Hệ thống đặt bánh kem trực tuyến Enterprise với kiến trúc **ReactJS Frontend + Node.js REST API Gateway + SQL Server Stored Procedures**.

---

## 📁 Cấu Trúc Dự Án (Project Architecture)

```
cake-ordering-website/
├── backend/            # Express.js REST API Gateway (Node.js + mssql)
│   ├── src/
│   │   ├── config/     # Connection Pool SQL Server
│   │   ├── controllers/# Request Handlers
│   │   ├── db/         # Schema, Migration & Stored Procedures SQL Server
│   │   ├── middlewares/# JWT Auth, RBAC, Rate Limiter & Global Error Handler
│   │   ├── repositories/# SQL Stored Procedure Execution Layer
│   │   ├── routes/     # API Route Endpoints
│   │   └── services/   # Business Services & Validation
│   └── tests/          # Automated Security & Logic Audit Test Suite
├── frontend/           # ReactJS + Vite Web Application
│   ├── src/
│   │   ├── api/        # Axios REST Client
│   │   ├── assets/     # Enterprise Bakery Design System CSS
│   │   ├── components/ # Layouts & Reusable UI Components (Stepper, Stars...)
│   │   ├── context/    # Auth, Cart & Toast Contexts
│   │   └── pages/      # Public, Customer & Admin Pages
├── docs/               # Production Readiness Audit Report
└── README.md
```

---

## 🚀 Hướng Dẫn Khởi Chạy Môi Trường Phát Triển (Quick Start)

### 1. Khởi tạo Cơ Sở Dữ Liệu SQL Server
1. Mở SQL Server Management Studio (SSMS).
2. Thực thi file [backend/src/db/schema.sql](backend/src/db/schema.sql) (Bấm F5).
3. Thực thi file [backend/src/db/procedures.sql](backend/src/db/procedures.sql) (Bấm F5).

### 2. Khởi Chạy Backend Server
```bash
cd backend
npm install
npm run dev
```

### 3. Khởi Chạy Frontend React App
```bash
cd frontend
npm install
npm run dev
```

---

## 🛡️ Chạy Kiểm Thử Tự Động (Automated Security Audit Tests)
```bash
cd backend
npm test
```

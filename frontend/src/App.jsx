import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';

import { HomePage } from './pages/public/HomePage';
import { ProductsPage } from './pages/public/ProductsPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { CartPage } from './pages/public/CartPage';
import { CheckoutPage } from './pages/public/CheckoutPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminLogsPage } from './pages/admin/AdminLogsPage';

// Protected Route Component for Customer
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Protected Route Component for Admin / Manager
const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <Navigate to="/login" replace />;
  return children;
};

export const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Public & Customer Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="profile" element={<ProtectedRoute><CustomerProfilePage /></ProtectedRoute>} />
                <Route path="about" element={
                  <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
                    <h1 style={{ color: '#3C2A21' }}>Về Tiệm Bánh Artisan</h1>
                    <p style={{ color: '#8D7B68', marginTop: '16px', maxWidth: '600px', margin: '16px auto' }}>
                      Tiệm bánh thành lập từ năm 2026 với sứ mệnh mang đến những mẻ bánh kem tươi ngon nhất, chuẩn hương vị kem bơ Pháp ngọt thanh tan chảy.
                    </p>
                  </div>
                } />
              </Route>

              {/* Admin Portal Routes */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="logs" element={<AdminLogsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;

import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartApi } from '../api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { showToast } = useToast();

  const fetchCart = async () => {
    if (!token) {
      setCart({ items: [], totalAmount: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      setCart(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (masp, soluong = 1, kichco = null) => {
    if (!token) {
      showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.', 'error');
      return false;
    }
    try {
      const res = await cartApi.addToCart({ masp, soluong, kichco });
      setCart(res.data);
      showToast('Đã thêm sản phẩm vào giỏ hàng thành công!');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const removeItem = async (masp) => {
    try {
      const res = await cartApi.removeItem(masp);
      setCart(res.data);
      showToast(masp === 'clear' ? 'Đã xóa giỏ hàng' : 'Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const itemCount = cart.items ? cart.items.reduce((sum, item) => sum + item.SOLUONG, 0) : 0;

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, removeItem, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

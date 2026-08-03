import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  register: (userData) => axiosClient.post('/auth/register', userData),
  getProfile: () => axiosClient.get('/auth/profile'),
};

export const userApi = {
  getProfile: () => axiosClient.get('/user/profile'),
  updateProfile: (data) => axiosClient.put('/user/profile', data),
  changePassword: (data) => axiosClient.put('/user/change-password', data),
};

export const productApi = {
  getProducts: (params) => axiosClient.get('/products', { params }),
  getProductDetail: (id) => axiosClient.get(`/products/${id}`),
  upsertProduct: (formData) =>
    axiosClient.post('/products/upsert', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const cartApi = {
  getCart: () => axiosClient.get('/cart'),
  addToCart: (data) => axiosClient.post('/cart/add', data),
  removeItem: (masp) => axiosClient.delete(`/cart/item/${masp}`),
};

export const orderApi = {
  createOrder: (orderData) => axiosClient.post('/orders/checkout', orderData),
  getMyOrders: (params) => axiosClient.get('/orders/my-orders', { params }),
  getAllOrders: (params) => axiosClient.get('/orders/all', { params }),
  getOrderDetail: (madh) => axiosClient.get(`/orders/detail/${madh}`),
  updateStatus: (madh, trangthai) => axiosClient.put(`/orders/status/${madh}`, { trangthai }),
  cancelOrder: (madh, lydo) => axiosClient.put(`/orders/cancel/${madh}`, { lydo }),
};

export const voucherApi = {
  applyVoucher: (data) => axiosClient.post('/vouchers/apply', data),
};

export const reviewApi = {
  getProductReviews: (masp) => axiosClient.get(`/reviews/product/${masp}`),
  addReview: (reviewData) => axiosClient.post('/reviews/add', reviewData),
  replyReview: (madg, phanhoi) => axiosClient.put(`/reviews/reply/${madg}`, { phanhoi }),
};

export const adminApi = {
  getDashboardData: () => axiosClient.get('/admin/dashboard'),
  getLoginLogs: () => axiosClient.get('/admin/logs'),
};

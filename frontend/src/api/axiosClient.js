import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cake_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract response data or handle global 401/403 errors
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message || 'Có lỗi xảy ra khi kết nối tới máy chủ. Vui lòng thử lại sau.';
    
    if (error.response?.status === 401) {
      // Clear token on 401
      localStorage.removeItem('cake_token');
      localStorage.removeItem('cake_user');
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;

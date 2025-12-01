import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const login = (email, password) => 
  api.post('/auth/login', { email, password });

export const register = (userData) => 
  api.post('/auth/register', userData);

export const getProfile = () => 
  api.get('/auth/profile');

export const updateProfile = (userData) => 
  api.put('/auth/profile', userData);

// Products
export const getProducts = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/products${queryString ? `?${queryString}` : ''}`);
};

export const getProduct = (id) => 
  api.get(`/products/${id}`);

// Categories
export const getCategories = () => 
  api.get('/categories');

export const getCategory = (id) => 
  api.get(`/categories/${id}`);

// Cart
export const getCart = () => 
  api.get('/cart');

export const addToCart = (productId, quantity = 1) => 
  api.post('/cart', { productId, quantity });

export const updateCartItem = (productId, quantity) => 
  api.put(`/cart/${productId}`, { quantity });

export const removeCartItem = (productId) => 
  api.delete(`/cart/${productId}`);

export const clearCart = () => 
  api.delete('/cart');

// Orders
export const getOrders = () => 
  api.get('/orders');

export const getOrder = (id) => 
  api.get(`/orders/${id}`);

export const createOrder = (orderData) => 
  api.post('/orders', orderData);

// Reviews
export const getReviews = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/reviews${queryString ? `?${queryString}` : ''}`);
};

export const createReview = (reviewData) => 
  api.post('/reviews', reviewData);

export default api;


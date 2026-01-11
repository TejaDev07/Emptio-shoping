import axios from 'axios';

const API_URL = process.env.VITE_API_URL;
const API_BASE_URL = `${API_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚫 Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If using a mock/demo token, don't auto-logout — allow UI to handle fallback
      const token = localStorage.getItem('token');
      if (token && token.startsWith && token.startsWith('mock-admin-token-')) {
        console.warn('Received 401 for mock token — skipping auto-logout');
        return Promise.reject(error);
      }

      // For real tokens, clear session and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminUser');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Admin API functions
export const adminApi = {
  // Auth - Login to get real JWT token
  login: async (email, password) => {
    try {
      // For admin login, we need to authenticate with the real backend
      // First try to login as admin user from your user database
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { user, token } = response.data;
      
      // Verify this is an admin user
      if (user.role !== 'admin') {
        throw new Error('Not authorized as admin');
      }

      return { user, token };
    } catch (error) {
      // If backend login fails, fall back to mock for demo
      if (email === 'admin@emptio.com' && password === 'Admin@123') {
        const user = {
          email: email,
          role: 'admin',
          name: 'Admin User',
          _id: 'admin-mock-id'
        };
        const token = 'mock-admin-token-' + Date.now();
        
        localStorage.setItem('token', token);
        
        return { user, token };
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Orders - Get all orders from real backend
  getAllOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/orders?${queryString}`);
      return response;
    } catch (error) {
      console.error('Error fetching orders from backend:', error);
      // Don't fall back to mock data - show the real error
      throw error;
    }
  },

  // Get single order by ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/admin/orders/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (id, status, note, trackingNumber) => {
    try {
      const response = await api.put(`/admin/orders/${id}/status`, { status, note, trackingNumber });
      return response;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Get order statistics
  getOrderStats: async () => {
    try {
      const response = await api.get('/admin/orders/stats');
      return response;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  },

  // Users (Optional - if you have admin user management)
  getAllUsers: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      return await api.get(`/admin/users?${queryString}`);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Products - Admin product management
  getAllProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      return await api.get(`/admin/products?${queryString}`);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product by ID
  getProductById: async (id) => {
    try {
      return await api.get(`/admin/products/${id}`);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Create product
  createProduct: async (productData) => {
    try {
      return await api.post('/admin/products', productData);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      return await api.put(`/admin/products/${id}`, productData);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete/disable product
  deleteProduct: async (id) => {
    try {
      return await api.delete(`/admin/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
};

export default api;

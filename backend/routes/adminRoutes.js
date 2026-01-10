const express = require('express');
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/adminController');

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Order routes
// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/orders', getAllOrders);

// @route   GET /api/admin/orders/stats
// @desc    Get order statistics
// @access  Private/Admin
router.get('/orders/stats', getOrderStats);

// @route   GET /api/admin/orders/:id
// @desc    Get single order
// @access  Private/Admin
router.get('/orders/:id', getOrderById);

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/orders/:id/status', updateOrderStatus);

// Product routes
// @route   GET /api/admin/products
// @desc    Get all products (including inactive for admin)
// @access  Private/Admin
router.get('/products', getAllProducts);

// @route   GET /api/admin/products/:id
// @desc    Get single product by ID
// @access  Private/Admin
router.get('/products/:id', getProductById);

// @route   POST /api/admin/products
// @desc    Create a product
// @access  Private/Admin
router.post('/products', createProduct);

// @route   PUT /api/admin/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/products/:id', updateProduct);

// @route   DELETE /api/admin/products/:id
// @desc    Delete/disable a product
// @access  Private/Admin
router.delete('/products/:id', deleteProduct);

module.exports = router;
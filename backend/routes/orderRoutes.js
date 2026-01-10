const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getOrderById,
  getUserOrders,
  getGuestOrders,
  updateOrderStatus,
  cancelOrder,
  requestReturn,
  getAllOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// =================================================
// CREATE ORDER
// @route   POST /api/orders
// @desc    Create new order
// @access  Public (demo purpose)
// =================================================
router.post(
  '/',
  [
    body('items', 'Items are required').isArray({ min: 1 }),
    body('shippingAddress.firstName', 'First name is required').notEmpty(),
    body('shippingAddress.lastName', 'Last name is required').notEmpty(),
    body('shippingAddress.email', 'Valid email is required').isEmail(),
    body('shippingAddress.address', 'Address is required').notEmpty(),
    body('shippingAddress.city', 'City is required').notEmpty(),
    body('shippingAddress.zipCode', 'ZIP code is required').notEmpty(),
    body('totalAmount', 'Total amount must be positive').isFloat({ min: 0 }),
  ],
  createOrder
);

// =================================================
// ADMIN ROUTES (⚠ MUST BE BEFORE /:id)
// =================================================

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get(
  '/admin/all',
  protect,
  authorize('admin'),
  getAllOrders
);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put(
  '/:id/status',
  protect,
  authorize('admin'),
  updateOrderStatus
);

// =================================================
// USER ROUTES
// =================================================

// @route   GET /api/orders/guest
// @desc    Get orders by email for guest users
// @access  Public
router.get('/guest', getGuestOrders);

// @route   GET /api/orders
// @desc    Get logged-in user orders
// @access  Private
router.get('/', protect, getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, getOrderById);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, cancelOrder);

// @route   PUT /api/orders/:id/return
// @desc    Request return
// @access  Private
router.put('/:id/return', protect, requestReturn);

module.exports = router;

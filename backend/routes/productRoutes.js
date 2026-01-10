const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
  getFeaturedProducts,
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', getFeaturedProducts);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Create a product
// @access  Public (temporary for testing)
router.post('/', createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete/disable a product
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteProduct);

// @route   POST /api/products/seed
// @desc    Seed products
// @access  Public (temporary)
router.post('/seed', seedProducts);

module.exports = router;
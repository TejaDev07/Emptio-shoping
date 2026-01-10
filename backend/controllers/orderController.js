const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const { sendOrderConfirmation, sendOrderStatusUpdate } = require('../services/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (would require authentication in production)
const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     console.log('❌ Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    items,
    shippingAddress,
    paymentInfo,
    totalAmount,
    userId, // This would come from JWT token in production
  } = req.body;

  console.log('🔍 Order creation request received');
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  console.log('🛒 Items:', items);
  console.log('📍 Shipping address:', shippingAddress);
  console.log('💳 Payment info:', paymentInfo);
  console.log('💰 Total amount:', totalAmount);
  console.log('👤 User ID:', userId);

  try {
    // Validate required fields
    if (!items || items.length === 0) {
      console.log('❌ No items in order');
      return res.status(400).json({ message: 'No items in order' });
    }

    if (!shippingAddress || !paymentInfo || !totalAmount) {
      console.log('❌ Missing required order information');
      return res.status(400).json({ message: 'Missing required order information' });
    }

    // Validate shipping address fields
    const requiredShippingFields = ['firstName', 'lastName', 'email', 'address', 'city', 'zipCode'];
    for (const field of requiredShippingFields) {
      if (!shippingAddress[field]) {
        console.log(`❌ Missing shipping field: ${field}`);
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Validate payment info fields
    if (!paymentInfo.cardNumber || !paymentInfo.expiryDate) {
      console.log('❌ Missing payment information');
      return res.status(400).json({ message: 'Missing payment information' });
    }

    // Validate items structure
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.productId || !item.name || !item.price || !item.quantity || !item.image) {
        console.log(`❌ Invalid item structure at index ${i}:`, item);
        return res.status(400).json({ message: `Invalid item structure at index ${i}` });
      }
    }

    console.log('✅ All validations passed, creating order...');

    // Create order
    const order = await Order.create({
      user: userId || null, // Allow null for guest orders
      items,
      shippingAddress,
      paymentInfo,
      totalAmount,
      paymentMethod: req.body.paymentMethod || 'card',
      orderNotes: req.body.orderNotes || '',
    });

    // Add initial status to history
    order.statusHistory.push({
      status: 'placed',
      timestamp: new Date(),
      note: 'Order placed successfully',
    });

    order.markModified('statusHistory');

    await order.save();

    console.log('✅ Order created successfully:', order._id);

    // Send confirmation email
    try {
      await sendOrderConfirmation(order, shippingAddress.email);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        id: order._id,
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error('💥 Error creating order:', error);
    console.error('💥 Error details:', error.message);
    console.error('💥 Error stack:', error.stack);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get orders by email (for guest users)
// @route   GET /api/orders/guest
// @access  Public
const getGuestOrders = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const orders = await Order.find({
      'shippingAddress.email': email,
      status: { $nin: ['cancelled', 'returned'] }
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders for a user
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    // Find orders by user ID or by shipping email, exclude cancelled and returned
    const orders = await Order.find({
      $or: [
        { user: req.user.id },
        { 'shippingAddress.email': req.user.email }
      ],
      status: { $nin: ['cancelled', 'returned'] } // Exclude cancelled and returned orders from user view
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, note } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Add to status history
    await order.addStatusToHistory(status, note || '');
    
    // Update tracking number if provided
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    await order.save();
    
    // Send status update email
    try {
      await sendOrderStatusUpdate(order, order.shippingAddress.email);
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // Don't fail the status update if email fails
    }
    
    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order can be cancelled (not shipped or delivered)
    if (['shipped', 'out_for_delivery', 'delivered'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }
    
    order.cancellationReason = reason || 'Cancelled by user';
    await order.addStatusToHistory('cancelled', reason || 'Cancelled by user');
    
    // Notify customer about cancellation
    try {
      await sendOrderStatusUpdate(order, order.shippingAddress.email);
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // don't fail the operation if email fails
    }

    res.json({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Request return
// @route   PUT /api/orders/:id/return
// @access  Private
const requestReturn = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Order must be delivered to request return' });
    }
    
    order.returnReason = reason || 'Return requested by user';
    order.returnRequestedAt = new Date();
    await order.addStatusToHistory('returned', reason || 'Return requested by user');
    
    // Notify customer about return request
    try {
      await sendOrderStatusUpdate(order, order.shippingAddress.email);
    } catch (emailError) {
      console.error('Failed to send return notification email:', emailError);
    }

    res.json({
      message: 'Return request submitted successfully',
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    
    let query = {};
    
    // Only exclude cancelled/returned if no specific status filter is applied
    if (!status || status === 'all') {
      query.status = { $nin: ['cancelled', 'returned'] };
    } else if (status) {
      query.status = status;
    }
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  getGuestOrders,
  updateOrderStatus,
  cancelOrder,
  requestReturn,
  getAllOrders,
};
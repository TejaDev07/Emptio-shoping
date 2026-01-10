const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Allow guest orders
  },
  items: [{
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  }],
  shippingAddress: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
  },
  paymentInfo: {
    cardNumber: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    // Note: In production, never store full card details
    // This is just for demo purposes
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'placed',
  },
  trackingNumber: {
    type: String,
    default: null,
  },
  estimatedDelivery: {
    type: Date,
    default: null,
  },
  actualDelivery: {
    type: Date,
    default: null,
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'net_banking', 'cod'],
    default: 'card',
  },
  orderNotes: {
    type: String,
    default: '',
  },
  statusHistory: [{
    status: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: '',
    },
  }],
  cancellationReason: {
    type: String,
    default: null,
  },
  returnReason: {
    type: String,
    default: null,
  },
  returnRequestedAt: {
    type: Date,
    default: null,
  },
  orderId: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate unique order ID and set estimated delivery before saving
orderSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  
  // Set estimated delivery if not set and status is confirmed or later
  if (!this.estimatedDelivery && ['confirmed', 'processing', 'shipped', 'out_for_delivery'].includes(this.status)) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days from now
    this.estimatedDelivery = deliveryDate;
  }
  
  // Set actual delivery when status becomes delivered
  if (this.status === 'delivered' && !this.actualDelivery) {
    this.actualDelivery = new Date();
  }
  
  this.updatedAt = new Date();
  next();
});

// Add status change to history
orderSchema.methods.addStatusToHistory = function(newStatus, note = '') {
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note,
  });
  this.status = newStatus;
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
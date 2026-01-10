const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  rating: {
    type: Number,
    default: 0,
  },
  brand: {
    type: String,
  },
  discount: {
    type: Number,
    default: 0,
  },
  specifications: {
    type: Map,
    of: String,
  },
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
  }],
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
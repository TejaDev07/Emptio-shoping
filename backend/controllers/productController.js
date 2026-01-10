const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, subcategory, subsubcategory } = req.query;

    console.log('🔍 Products request with filters:', { category, subcategory, subsubcategory });

    // Build filter object - only active products for public API
    let filter = { status: 'active' };

    if (category) {
      // Case-insensitive category matching
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (subcategory) {
      filter.subcategory = new RegExp(`^${subcategory}$`, 'i');
    }

    if (subsubcategory) {
      filter.subsubcategory = new RegExp(`^${subsubcategory}$`, 'i');
    }

    console.log('🔍 MongoDB filter:', filter);

    const products = await Product.find(filter);
    console.log(`✅ Found ${products.length} products matching filters`);

    res.json(products);
  } catch (error) {
    console.error('💥 Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all products (Admin - includes inactive)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProducts = async (req, res) => {
  try {
    const { category, subcategory, subsubcategory } = req.query;

    console.log('🔍 Admin products request with filters:', { category, subcategory, subsubcategory });

    // Build filter object - admin sees all products
    let filter = {};

    if (category) {
      // Case-insensitive category matching
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (subcategory) {
      filter.subcategory = new RegExp(`^${subcategory}$`, 'i');
    }

    if (subsubcategory) {
      filter.subsubcategory = new RegExp(`^${subsubcategory}$`, 'i');
    }

    console.log('🔍 MongoDB filter:', filter);

    const products = await Product.find(filter);
    console.log(`✅ Found ${products.length} products matching filters`);

    res.json(products);
  } catch (error) {
    console.error('💥 Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'active' }).limit(8);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const requestedId = req.params.id;
    console.log('🔍 Product request for ID:', requestedId);

    let product = null;

    // Check if the requestedId is a valid ObjectId
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(requestedId)) {
      product = await Product.findById(requestedId);
      if (product) {
        console.log('✅ Product found by _id:', product._id);
      }
    }

    if (!product) {
      console.log('❌ Product not found by _id, trying custom id field...');
      // If not found by _id, try finding by the custom id field
      const numericId = parseInt(requestedId);
      if (!isNaN(numericId)) {
        product = await Product.findOne({ id: numericId });
        if (product) {
          console.log('✅ Product found by custom id field:', product._id);
        } else {
          console.log('❌ Product not found by custom id field either');
        }
      } else {
        console.log('❌ Invalid ID format');
      }
    }

    if (product) {
      res.json(product);
    } else {
      console.log('🚫 No product found for ID:', requestedId);
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('💥 Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete/disable a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Instead of deleting, set status to inactive
    await Product.findByIdAndUpdate(req.params.id, { status: 'inactive' });

    res.json({ message: 'Product disabled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Seed products
// @route   POST /api/products/seed
// @access  Public (temporary)
const seedProducts = async (req, res) => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    const products = [
      {
        name: 'Men Shoes',
        description: 'Premium quality men\'s shoes with superior comfort and style. Perfect for casual wear and sports activities.',
        price: 299,
        images: ['/images/shoes.jpg'],
        category: 'fashion',
        stock: 50,
        status: 'active',
        rating: 4.5,
        brand: 'Nike',
        discount: 15,
        specifications: {
          'Material': 'Synthetic Leather',
          'Sole': 'Rubber',
          'Size Range': '7-12',
          'Color': 'Black',
          'Weight': 'Lightweight'
        },
        reviews: [
          { user: 'Mike Johnson', rating: 5, comment: 'Great comfort and style!' },
          { user: 'Sarah Wilson', rating: 4, comment: 'Good quality for the price.' }
        ]
      },
      {
        name: 'Crepe T-shirt',
        description: 'Comfortable crepe t-shirt made from high-quality fabric. Perfect for everyday wear.',
        price: 25,
        images: ['/images/tshirt.jpg'],
        category: 'fashion',
        stock: 100,
        status: 'active',
        rating: 4.2,
        brand: 'H&M',
        discount: 10,
        specifications: {
          'Material': '100% Cotton',
          'Fit': 'Regular',
          'Sleeve': 'Short',
          'Color': 'White',
          'Care': 'Machine Wash'
        },
        reviews: [
          { user: 'Emma Davis', rating: 4, comment: 'Nice fabric and comfortable fit.' },
          { user: 'Tom Brown', rating: 4, comment: 'Good quality basic t-shirt.' }
        ]
      },
      {
        name: 'Leather Watch',
        description: 'Elegant leather watch with premium craftsmanship. A timeless piece for any occasion.',
        price: 150,
        images: ['/images/leatherwatch.jpg'],
        category: 'fashion',
        stock: 25,
        status: 'active',
        rating: 4.8,
        brand: 'Rolex',
        discount: 20,
        isFeatured: true,
        specifications: {
          'Case Material': 'Stainless Steel',
          'Band Material': 'Genuine Leather',
          'Movement': 'Quartz',
          'Water Resistance': '50M',
          'Warranty': '2 Years'
        },
        reviews: [
          { user: 'David Lee', rating: 5, comment: 'Beautiful watch, great quality!' },
          { user: 'Lisa Chen', rating: 5, comment: 'Perfect for formal occasions.' }
        ]
      },
      {
        name: 'Mobile',
        description: 'Latest smartphone with advanced features, high-quality camera, and long battery life.',
        price: 500,
        images: ['/images/mobile.jpg'],
        category: 'electronics',
        stock: 30,
        status: 'active',
        rating: 4.9,
        brand: 'Samsung',
        discount: 25,
        isFeatured: true,
        specifications: {
          'Screen Size': '6.5 inches',
          'Storage': '128GB',
          'RAM': '8GB',
          'Camera': '64MP Triple',
          'Battery': '5000mAh'
        },
        reviews: [
          { user: 'Alex Rodriguez', rating: 5, comment: 'Amazing camera and performance!' },
          { user: 'Maria Garcia', rating: 5, comment: 'Best phone I\'ve ever owned.' }
        ]
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium wireless headphones with noise cancellation and superior sound quality.',
        price: 199,
        images: ['/images/mobile.jpg'],
        category: 'electronics',
        stock: 40,
        status: 'active',
        rating: 4.7,
        brand: 'Sony',
        discount: 30,
        specifications: {
          'Type': 'Over-ear',
          'Battery Life': '30 hours',
          'Connectivity': 'Bluetooth 5.0',
          'Noise Cancellation': 'Active',
          'Weight': '250g'
        },
        reviews: [
          { user: 'Chris Taylor', rating: 5, comment: 'Excellent sound quality!' },
          { user: 'Anna White', rating: 4, comment: 'Great noise cancellation.' }
        ]
      },
      {
        name: 'Designer Sunglasses',
        description: 'Stylish designer sunglasses with UV protection and premium lenses.',
        price: 89,
        images: ['/images/shoes.jpg'],
        category: 'fashion',
        stock: 60,
        status: 'active',
        rating: 4.3,
        brand: 'Ray-Ban',
        discount: 15,
        specifications: {
          'Frame Material': 'Metal',
          'Lens Type': 'Polarized',
          'UV Protection': '100%',
          'Style': 'Aviator',
          'Color': 'Gold'
        },
        reviews: [
          { user: 'James Wilson', rating: 4, comment: 'Good quality and style.' },
          { user: 'Sophie Martin', rating: 4, comment: 'Comfortable and protective.' }
        ]
      },
      {
        name: 'Gaming Laptop',
        description: 'High-performance gaming laptop with powerful graphics and fast processing.',
        price: 1299,
        images: ['/images/mobile.jpg'],
        category: 'electronics',
        stock: 15,
        status: 'active',
        rating: 4.8,
        brand: 'Dell',
        discount: 20,
        specifications: {
          'Processor': 'Intel i7',
          'RAM': '16GB',
          'Storage': '512GB SSD',
          'Graphics': 'RTX 3060',
          'Display': '15.6" 144Hz'
        },
        reviews: [
          { user: 'Ryan Parker', rating: 5, comment: 'Amazing gaming performance!' },
          { user: 'Zoe Thompson', rating: 5, comment: 'Perfect for gaming and work.' }
        ]
      },
      {
        name: 'Running Sneakers',
        description: 'Professional running sneakers with advanced cushioning and support.',
        price: 129,
        images: ['/images/shoes.jpg'],
        category: 'sports',
        stock: 75,
        status: 'active',
        rating: 4.6,
        brand: 'Adidas',
        discount: 10,
        specifications: {
          'Type': 'Running',
          'Material': 'Mesh',
          'Sole': 'Boost Technology',
          'Weight': '280g',
          'Support': 'Neutral'
        },
        reviews: [
          { user: 'Kevin Davis', rating: 5, comment: 'Great for long runs!' },
          { user: 'Laura Miller', rating: 4, comment: 'Comfortable and lightweight.' }
        ]
      },
      {
        name: 'Classic White T-Shirt',
        description: 'Classic white t-shirt perfect for everyday wear.',
        price: 25,
        images: ['/images/tshirt.jpg'],
        category: 'fashion',
        stock: 100,
        status: 'active',
        rating: 4.5,
        brand: 'Nike',
        discount: 10,
        specifications: {
          'Material': '100% Cotton',
          'Fit': 'Regular',
          'Sleeve': 'Short',
          'Color': 'White',
          'Care': 'Machine Wash'
        },
        reviews: [
          { user: 'John Smith', rating: 5, comment: 'Perfect basic t-shirt!' },
          { user: 'Jane Doe', rating: 4, comment: 'Good quality.' }
        ]
      },
      {
        name: 'Slim Fit Polo Shirt',
        description: 'Elegant polo shirt with slim fit design.',
        price: 35,
        images: ['/src/assets/images/polo.jpg'],
        category: 'fashion',
        stock: 80,
        status: 'active',
        rating: 4.2,
        brand: 'Polo',
        discount: 15,
        specifications: {
          'Material': 'Cotton Blend',
          'Fit': 'Slim',
          'Sleeve': 'Short',
          'Color': 'Navy',
          'Care': 'Machine Wash'
        }
      },
      {
        name: 'Leather Backpack',
        description: 'Stylish leather backpack with multiple compartments for everyday use.',
        price: 89,
        images: ['/src/assets/images/backpack.jpg'],
        category: 'bags',
        stock: 35,
        status: 'active',
        rating: 4.7,
        brand: 'Levi\'s',
        discount: 15,
        specifications: {
          'Material': 'Genuine Leather',
          'Capacity': '25L',
          'Compartments': 'Multiple',
          'Straps': 'Adjustable',
          'Color': 'Brown'
        },
        reviews: [
          { user: 'Mike Johnson', rating: 5, comment: 'Great quality and style!' },
          { user: 'Sarah Wilson', rating: 4, comment: 'Perfect for daily use.' }
        ]
      },
      {
        name: 'Travel Duffel Bag',
        description: 'Durable duffel bag ideal for travel and gym sessions.',
        price: 65,
        images: ['/src/assets/images/duffel.jpg'],
        category: 'bags',
        stock: 45,
        status: 'active',
        rating: 4.4,
        brand: 'Nike',
        discount: 10,
        specifications: {
          'Material': 'Nylon',
          'Capacity': '40L',
          'Features': 'Wheels',
          'Color': 'Black',
          'Weight': '1.5kg'
        },
        reviews: [
          { user: 'Emma Davis', rating: 4, comment: 'Good for travel.' },
          { user: 'Tom Brown', rating: 5, comment: 'Very durable!' }
        ]
      },
      {
        name: 'Tote Bag',
        description: 'Casual tote bag perfect for shopping and everyday carry.',
        price: 25,
        images: ['/src/assets/images/tote.jpg'],
        category: 'bags',
        stock: 90,
        status: 'active',
        rating: 4.2,
        brand: 'H&M',
        discount: 5,
        specifications: {
          'Material': 'Canvas',
          'Handles': 'Cotton',
          'Size': 'Medium',
          'Color': 'Beige',
          'Care': 'Hand Wash'
        },
        reviews: [
          { user: 'Lisa Chen', rating: 4, comment: 'Nice and spacious.' },
          { user: 'David Lee', rating: 4, comment: 'Good value.' }
        ]
      }
    ];

    const createdProducts = await Product.insertMany(products);
    res.status(201).json({
      message: `${createdProducts.length} products seeded successfully`,
      products: createdProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
  getFeaturedProducts,
};
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman or server-to-server
    if (
      origin === 'https://emptio-shoping.vercel.app' ||
      origin === 'https://emptio-shoping-tozz.vercel.app' ||
      origin.endsWith('.vercel.app') || // Any Vercel preview
      origin === 'http://localhost:5173' ||
      origin === 'http://localhost:5174' ||
      origin === 'http://localhost:5175' ||
      origin === 'http://localhost:5176'
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Emptio Backend API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

/* =========================
   CORS CONFIG (FINAL)
   ========================= */
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.startsWith('http://localhost') ||
      origin === 'https://emptio-shoping.vercel.app' ||
      origin === 'https://emptio-shoping-tozz.vercel.app' ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


/* Body parsers */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Routes */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

/* Root */
app.get('/', (req, res) => {
  res.json({ message: 'Emptio Backend API' });
});

/* Error handler (CORS SAFE) */
app.use((err, req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server error' });
});

/* Start server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

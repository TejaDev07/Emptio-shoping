const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing. Check your .env file.');
    }

    console.log('🔍 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ Connected to DB:', conn.connection.name);
    console.log('✅ Host:', conn.connection.host);

    const adminExists = await User.findOne({ email: 'admin@emptio.com' });
    console.log('Admin exists?', !!adminExists);

    if (adminExists) {
      console.log('⚠️ Admin user already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await User.create({
      name: 'Admin User',
      email: 'admin@emptio.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('🎉 Admin user created successfully');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();

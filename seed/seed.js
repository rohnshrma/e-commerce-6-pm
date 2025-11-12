require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Product = require('../src/models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data...');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
      profile: {
        address: '123 Admin Street',
        phone: '123-456-7890',
      },
    });
    console.log('Admin created:', admin.email, '| Password: admin123');

    // Create Vendor
    const vendor = await User.create({
      name: 'Vendor User',
      email: 'vendor@example.com',
      passwordHash: 'vendor123',
      role: 'vendor',
      profile: {
        address: '456 Vendor Avenue',
        phone: '234-567-8901',
      },
    });
    console.log('Vendor created:', vendor.email, '| Password: vendor123');

    // Create Buyer
    const buyer = await User.create({
      name: 'Buyer User',
      email: 'buyer@example.com',
      passwordHash: 'buyer123',
      role: 'buyer',
      profile: {
        address: '789 Buyer Road',
        phone: '345-678-9012',
      },
    });
    console.log('Buyer created:', buyer.email, '| Password: buyer123');

    // Create Sample Products
    const products = [
      {
        title: 'Laptop Computer',
        description: 'High-performance laptop with 16GB RAM and 512GB SSD',
        price: 999.99,
        stock: 10,
        images: ['https://example.com/laptop1.jpg', 'https://example.com/laptop2.jpg'],
        category: 'Electronics',
        vendor: vendor._id,
      },
      {
        title: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with long battery life',
        price: 29.99,
        stock: 50,
        images: ['https://example.com/mouse1.jpg'],
        category: 'Electronics',
        vendor: vendor._id,
      },
      {
        title: 'Office Chair',
        description: 'Comfortable ergonomic office chair',
        price: 199.99,
        stock: 20,
        images: ['https://example.com/chair1.jpg'],
        category: 'Furniture',
        vendor: vendor._id,
      },
      {
        title: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness',
        price: 39.99,
        stock: 30,
        images: ['https://example.com/lamp1.jpg'],
        category: 'Furniture',
        vendor: vendor._id,
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\n✅ Seeding completed successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Vendor: vendor@example.com / vendor123');
    console.log('Buyer: buyer@example.com / buyer123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();


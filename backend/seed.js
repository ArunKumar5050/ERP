#!/usr/bin/env node

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { seedDatabase } = require('./utils/seeders');

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/erp_system');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const runSeeder = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Check if script is run directly
if (require.main === module) {
  runSeeder();
}

module.exports = { runSeeder };
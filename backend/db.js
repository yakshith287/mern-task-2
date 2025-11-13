const mongoose = require('mongoose');

async function connectdb() {
  try {
    await mongoose.connect('mongodb://localhost:27017/yakshith');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(' MongoDB connection failed:', err);
    process.exit(1);
  }
}

connectdb();

module.exports = mongoose;

const mongoose = require('mongoose');

async function connectdb() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mern_login_mongo');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(' MongoDB connection failed:', err);
    process.exit(1);
  }
}

connectdb();

module.exports = mongoose;

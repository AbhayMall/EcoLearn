const mongoose = require('mongoose');

async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecolearn';
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');
}

module.exports = { connectToDatabase };



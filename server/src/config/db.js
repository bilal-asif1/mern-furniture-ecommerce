import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not defined, skipping MongoDB connection for local demo mode');
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed, running in demo mode:', error.message);
    return false;
  }
};

export default connectDB;

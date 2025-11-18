import mongoose from 'mongoose';

export const connectDB = async () => {
  const dbURI = process.env.MONGO_URI;
  try {
    await mongoose.connect(dbURI);
    console.log(`MongoDB connected`);
  } catch (error) {
    console.error(`MongoDB connecting error: ${error}`);
    process.exit(1);
  }
};

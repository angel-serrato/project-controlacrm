import mongoose from 'mongoose';

export const connectDB = async () => {
  const dbURI =
    process.env.NODE_ENV === 'development'
      ? process.env.MONGO_URI_DEV
      : process.env.MONGO_URI_PROD;
  try {
    await mongoose.connect(dbURI);
    console.log(`MongoDB connected in ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error(
      `MongoDB connecting error: ${error}, in ${process.env.NODE_ENV}`,
    );
    process.exit(1);
  }
};

import mongoose from 'mongoose';

export default async function connectDB(retries = 5, delay = 5000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i}/${retries} failed: ${err.message}`);
      if (i < retries) await new Promise((r) => setTimeout(r, delay));
    }
  }
  console.error('MongoDB failed after all retries — exiting.');
  process.exit(1);
}

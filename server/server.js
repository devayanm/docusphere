import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import searchRouter from './routes/search.js';

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI || '';

async function start() {
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI, { dbName: process.env.MONGODB_DB || undefined });
      console.log('✅ Connected to MongoDB');
    } catch (err) {
      console.warn('⚠️ Could not connect to MongoDB. Falling back to in-memory.', err.message);
    }
  } else {
    console.warn('ℹ️ No MONGODB_URI provided. Running in in-memory mode.');
  }

  app.use('/api/search', searchRouter);

  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`�� Server listening on http://localhost:${port}`));
}

start();

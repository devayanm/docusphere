import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import searchRouter from './routes/search.js';
import documentRoutes from './routes/documentRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.MONGODB_DB || undefined;

async function start() {
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: DB_NAME,
      });
      console.log('✅ Connected to MongoDB');
    } catch (err) {
      console.log(err)
      console.warn('⚠️ Could not connect to MongoDB. Falling back to in-memory.', err.message);
    }
  } else {
    console.warn('ℹ️ No MONGODB_URI provided. Running in in-memory mode.');
  }

  app.use('/api/auth', authRoutes);
  app.use('/api/search', searchRouter);
  app.use('/api/documents', documentRoutes);

  app.get('/', (req, res) => {
    res.send('🚀 Server is running');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}`);
  });
}

start();

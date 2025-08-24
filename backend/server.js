import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js'; // Add this line
import mongoose from "mongoose";

// Try to load .env first, then fallback to .env.example
dotenv.config({ path: '.env' });
if (!process.env.MONGODB_URI) {
    dotenv.config({ path: '.env.example' });
}

const PORT = process.env.PORT || 3000;

// Use a default MongoDB URI if not found in environment files
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/docusphere";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB connected");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes); // Add this line

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
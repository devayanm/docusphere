import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import sequelize from './config/database.js'; // You'll need to create this

// Try to load .env first, then fallback to .env.example
dotenv.config({ path: '.env' });
if (!process.env.DATABASE_URL) {
    dotenv.config({ path: '.env.example' });
}

const PORT = process.env.PORT || 3000;

// Test database connection and sync models
sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully.');
        return sequelize.sync(); // This creates tables if they don't exist
    })
    .then(() => {
        console.log('Database synced successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
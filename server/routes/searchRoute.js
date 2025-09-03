import express from 'express';
import { searchDocuments } from '../controllers/searchController.js';

const router = express.Router();

// GET /api/search?q=&types=markdown,pdf&tags=howto,guide&author=&from=2024-01-01&to=2025-12-31&sort=relevance|date|author&order=asc|desc&page=1&limit=20
router.get('/', searchDocuments);

export default router;

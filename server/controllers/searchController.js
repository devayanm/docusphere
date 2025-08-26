import { memoryQuery } from '../utils/memoryStore.js';
import Document from '../models/Document.js';


export const searchDocuments = async (req, res, next) => {
 try {
    const {
      q = '',
      types = '',
      tags = '',
      author = '',
      from = '',
      to = '',
      sort = 'relevance',
      order = 'desc',
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    // If mongoose is not connected, use in-memory fallback for local testing
    const isMongoReady = Document?.db?.readyState === 1;

    const filter = {};
    if (types) filter.type = { $in: String(types).split(',').map(s => s.trim()).filter(Boolean) };
    if (tags) filter.tags = { $all: String(tags).split(',').map(s => s.trim()).filter(Boolean) };
    if (author) filter.author = author;
    if (from || to) {
      filter.updatedAt = {};
      if (from) filter.updatedAt.$gte = new Date(from);
      if (to) filter.updatedAt.$lte = new Date(to);
    }

    if (!isMongoReady) {
      const result = memoryQuery({ q, filter, sort, order, page: pageNum, limit: limitNum });
      return res.json(result);
    }

    const hasQuery = q && q.trim().length > 0;
    const match = { ...filter, ...(hasQuery ? { $text: { $search: q } } : {}) };

    let sortStage = {};
    if (hasQuery && sort === 'relevance') {
      sortStage = { score: { $meta: 'textScore' }, updatedAt: -1 };
    } else if (sort === 'date') {
      sortStage = { updatedAt: order === 'asc' ? 1 : -1 };
    } else if (sort === 'author') {
      sortStage = { author: order === 'asc' ? 1 : -1, updatedAt: -1 };
    } else {
      sortStage = { updatedAt: -1 };
    }

    const project = hasQuery
      ? { title: 1, slug: 1, type: 1, tags: 1, author: 1, updatedAt: 1, score: { $meta: 'textScore' } }
      : { title: 1, slug: 1, type: 1, tags: 1, author: 1, updatedAt: 1 };

    const [items, total] = await Promise.all([
      Document.find(match, project).sort(sortStage).skip(skip).limit(limitNum).lean(),
      Document.countDocuments(match),
    ]);

    res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    next(err);
  }
};

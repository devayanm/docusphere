// Simple in-memory dataset and query for local testing without Mongo
const DATA = [
  {
    title: 'Getting Started Guide',
    slug: 'getting-started',
    type: 'markdown',
    tags: ['guide', 'intro'],
    author: 'core',
    contentText: 'Install, setup, and begin using DocuSphere. Tags and search.',
    updatedAt: new Date('2025-01-01T10:00:00Z')
  },
  {
    title: 'API Reference',
    slug: 'api-reference',
    type: 'markdown',
    tags: ['api', 'reference'],
    author: 'core',
    contentText: 'Endpoints, auth using JWT, RBAC scopes.',
    updatedAt: new Date('2025-02-10T08:00:00Z')
  },
  {
    title: 'Export to PDF',
    slug: 'export-pdf',
    type: 'pdf',
    tags: ['export', 'pdf'],
    author: 'tools',
    contentText: 'How to export documents to PDF and best practices.',
    updatedAt: new Date('2025-02-20T12:00:00Z')
  },
];

export function memoryQuery({ q, filter, sort, order, page, limit }) {
  let items = DATA.slice();

  // Filter by type
  if (filter.type?.$in?.length) {
    const allowed = new Set(filter.type.$in);
    items = items.filter(d => allowed.has(d.type));
  }

  // Filter by tags (all)
  if (filter.tags?.$all?.length) {
    const required = new Set(filter.tags.$all);
    items = items.filter(d => [...required].every(t => d.tags.includes(t)) );
  }

  // Filter by author
  if (filter.author) {
    items = items.filter(d => d.author === filter.author);
  }

  // Date range
  if (filter.updatedAt?.$gte) {
    items = items.filter(d => d.updatedAt >= filter.updatedAt.$gte);
  }
  if (filter.updatedAt?.$lte) {
    items = items.filter(d => d.updatedAt <= filter.updatedAt.$lte);
  }

  // Text search (very naive)
  if (q && q.trim()) {
    const qq = q.toLowerCase();
    items = items.filter(d => (
      d.title.toLowerCase().includes(qq) ||
      d.contentText.toLowerCase().includes(qq) ||
      d.tags.join(',').toLowerCase().includes(qq) ||
      d.author.toLowerCase().includes(qq)
    ));
  }

  // Sort
  if (sort === 'author') {
    items.sort((a, b) => a.author.localeCompare(b.author));
    if (order === 'desc') items.reverse();
  } else {
    // date or default
    items.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
    if (order !== 'asc') items.reverse();
  }

  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return { items: paged, total, page, pages: Math.ceil(total / limit) };
}

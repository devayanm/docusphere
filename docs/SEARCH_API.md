# Advanced Search API

Endpoint: `GET /api/search`

Query params:
- `q` (string): full-text query (title, tags, author, contentText)
- `types` (csv): e.g. `markdown,pdf,word`
- `tags` (csv): e.g. `howto,guide`
- `author` (string)
- `from`, `to` (ISO date): filter by `updatedAt`
- `sort` (relevance|date|author) default: relevance
- `order` (asc|desc) default: desc
- `page` (number), `limit` (number)

Examples:
- `/api/search?q=export&types=markdown,pdf&tags=guide`
- `/api/search?author=core&sort=date&order=desc&page=2&limit=10`

Notes:
- Relevance sorting requires the MongoDB text index defined on the `Document` model.
- If `MONGODB_URI` is not provided, the server runs with an in-memory dataset for local testing.

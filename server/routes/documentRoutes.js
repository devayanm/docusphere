import express from 'express';

const router = express.Router();

// Mock versions data
const mockVersions = [
  { id: 'v3', version: 3, content: '<h1>Welcome to DocuSphere</h1><p>Latest version with new features.</p>', createdBy: 'Carol', createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 'v2', version: 2, content: '<h1>Welcome to DocuSphere</h1><p>Version 2 with updates.</p>', createdBy: 'Bob', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'v1', version: 1, content: '<h1>Welcome to DocuSphere</h1><p>Initial version.</p>', createdBy: 'Alice', createdAt: new Date(Date.now() - 86400000).toISOString() }
];

router.get('/:id/history', (req, res) => {
  res.json(mockVersions);
});

router.post('/:id/restore/:versionId', (req, res) => {
  const version = mockVersions.find(v => v.id === req.params.versionId);
  if (!version) return res.status(404).json({ message: 'Version not found' });
  res.json({ message: 'Restored successfully', content: version.content });
});

export default router;
const Document = require('../models/Document'); // adjust if your model path/name differs
const DocumentVersion = require('../models/DocumentVersion');

// Update document and save version
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const editor = req.user?.name || 'Unknown'; // minimal auth integration

    const doc = await Document.findByPk(id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // Save current version
    await DocumentVersion.create({
      documentId: id,
      content: doc.content,
      version: (await DocumentVersion.count({ where: { documentId: id } })) + 1,
      createdBy: doc.updatedBy || editor
    });

    // Update document
    doc.content = content;
    doc.updatedBy = editor;
    await doc.save();

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get version history
exports.getHistory = async (req, res) => {
  try {
    const versions = await DocumentVersion.findAll({
      where: { documentId: req.params.id },
      order: [['version', 'DESC']]
    });
    res.json(versions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Restore a previous version
exports.restoreVersion = async (req, res) => {
  try {
    const version = await DocumentVersion.findByPk(req.params.versionId);
    if (!version) return res.status(404).json({ message: 'Version not found' });

    const doc = await Document.findByPk(req.params.id);
    doc.content = version.content;
    doc.updatedBy = req.user?.name || 'Unknown';
    await doc.save();

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

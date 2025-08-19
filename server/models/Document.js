import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['pdf', 'word', 'markdown'], index: true },
    tags: { type: [String], index: true },
    author: { type: String, index: true },
    contentText: { type: String, default: '' },
  },
  { timestamps: true }
);

DocumentSchema.index(
  { title: 'text', contentText: 'text', tags: 'text', author: 'text' },
  { weights: { title: 8, tags: 4, author: 2, contentText: 1 }, name: 'TextSearch' }
);

DocumentSchema.index({ updatedAt: -1 });
DocumentSchema.index({ author: 1, updatedAt: -1 });
DocumentSchema.index({ type: 1, updatedAt: -1 });
DocumentSchema.index({ tags: 1, updatedAt: -1 });

export default mongoose.model('Document', DocumentSchema);

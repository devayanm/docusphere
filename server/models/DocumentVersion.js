import mongoose from 'mongoose';

const documentVersionSchema = new mongoose.Schema({
  documentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Document'
  },
  content: { 
    type: String, 
    required: true 
  },
  version: { 
    type: Number, 
    required: true,
    default: 1
  },
  createdBy: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

// Create indexes for better performance
documentVersionSchema.index({ documentId: 1, version: 1 });
documentVersionSchema.index({ createdBy: 1 });

const DocumentVersion = mongoose.model('DocumentVersion', documentVersionSchema);

export default DocumentVersion;
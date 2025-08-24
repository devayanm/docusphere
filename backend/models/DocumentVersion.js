// DocumentVersion model for Sequelize with ES6 modules
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DocumentVersion = sequelize.define('DocumentVersion', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  documentId: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  content: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  version: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  createdBy: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  createdAt: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, { 
  tableName: 'document_versions', 
  timestamps: false 
});

export default DocumentVersion;
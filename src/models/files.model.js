import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';
import Folder from './folder.model.js';
const Files = sequelize.define('Files', {
  FileId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  FolderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Folder, 
        key: 'FolderId'
      }
  },
  FileName: {
    type: DataTypes.STRING(max),
    allowNull:false
    },

  ProjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project, 
      key: 'ProjectId'
    }
  },
  FileType:{
    type: DataTypes.STRING(50),
    allowNull:false
  },
  CreatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  CreatedBy: {  
    type: DataTypes.INTEGER,
  },
  ModifiedDate: {
    type: DataTypes.DATE,
  },
  DeletedDate: {
    type: DataTypes.DATE,
  },
}, {
  schema: 'project',
  timestamps: false,
  tableName: 'Files',
});

export default Files;

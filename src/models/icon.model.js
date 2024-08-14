import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';
import Project from './project.model.js';
import Folder from './folder.model.js';
const Icon = sequelize.define('Icon', {
  IconId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  IconName: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  ProjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project, // 'Project' would also work
      key: 'ProjectId'
    }
  },
  FolderId:{
    type: DataTypes.INTEGER,
    allowNull:false,
    references:{
      model:Folder,
      key:'FolderId'
    }
  },
  CreatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  CreatedBy:{
    type: DataTypes.STRING(255),
  },
  ModifiedDate: {
    type: DataTypes.DATE,
  },
  ModifiedBy:{
    type: DataTypes.STRING(255),

  },
  DeletedDate: {
    type: DataTypes.DATE,
  },
  DeletedBy:{
    type: DataTypes.STRING(255),
  }
}, {
  schema: 'icon',
  timestamps: false,
  tableName: 'Icon',
});

export default Icon;

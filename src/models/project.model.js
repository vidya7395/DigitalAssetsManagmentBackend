import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';
const Project = sequelize.define('Project', {
  ProjectId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ProjectName: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  ProjectLogo: {
    type: DataTypes.TEXT,
  },
  UniqueImageName: {
    type: DataTypes.TEXT,
  },
  ImageType: {
    type: DataTypes.STRING(50),
  },
  CreatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.DATE.NOW,
  },
  ModifiedDate: {
    type: DataTypes.DATE,
  },
  DeletedDate: {
    type: DataTypes.DATE,
  },
  ProjectImagePath: {
    type: DataTypes.TEXT,
  },
  CreatedBy:{
    type: DataTypes.STRING(255),

  },
  ModifiedBy:{
    type: DataTypes.STRING(255),
  
  },
  DeletedBy:{
    type: DataTypes.STRING(255),
  }
}, {
  schema: 'project',
  timestamps: false,
  tableName: 'Project',
});

export default Project;

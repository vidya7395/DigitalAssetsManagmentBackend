import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';

const Tag = sequelize.define('Tag', {
  TagId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  TagName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  CreatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ModifiedDate: {
    type: DataTypes.DATE,
  },
  DeletedDate: {
    type: DataTypes.DATE,
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
  schema: 'icon',
  timestamps: false,
  tableName: 'Tag',
});

export default Tag;


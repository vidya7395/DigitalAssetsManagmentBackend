import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';
import Icon from './icon.model.js';
import Tag from './tag.model.js';

const IconTag = sequelize.define('IconTag', {
  IconTagId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  TagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tag,
      key: 'TagId',
    },
  },
  IconId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Icon,
      key: 'IconId',
    },
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
  tableName: 'IconTag',
});

export default IconTag;

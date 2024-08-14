import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';
import Icon from './icon.model.js';
import Category from './category.model.js';

const IconCategory = sequelize.define('IconCategory', {
  IconCategoryId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  CategoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'CategoryId',
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
}, {
  schema: 'icon',
  timestamps: false,
  tableName: 'IconCategory',
});

export default IconCategory;

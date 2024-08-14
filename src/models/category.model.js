import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';

const Category = sequelize.define('Category', {
  CategoryId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  CategoryName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  CreatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  DeletedDate: {
    type: DataTypes.DATE,
  },
}, {
  schema: 'ref',
  timestamps: false,
  tableName: 'Category',
});

export default Category;

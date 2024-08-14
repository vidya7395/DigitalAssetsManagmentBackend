import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';

const Style = sequelize.define('Style', {
  StyleId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  StyleName: {
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
}, {
  schema: 'ref',
  timestamps: false,
  tableName: 'Style',
});

export default Style;

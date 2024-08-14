import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';
import Icon from './icon.model.js';
import Style from './style.model.js';

const IconStyle = sequelize.define('IconStyle', {
  IconStyleId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  StyleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Style,
      key: 'StyleId',
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
  tableName: 'IconStyle',
});

export default IconStyle;

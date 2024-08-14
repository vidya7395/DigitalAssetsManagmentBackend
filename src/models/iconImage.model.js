import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';
import Icon from './icon.model.js';
import IconVariantStyle from './iconVariantStyle.model.js';
// import IconVariantStyle from './iconVariantStyle.model.js';
const IconImage = sequelize.define('IconImage', {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ImageName: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  IconId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Icon,
      key: 'IconId',
    },
  },
  IconVariantStyleId:{
    type: DataTypes.INTEGER,
    references: {
      model: IconVariantStyle,
      key: 'IconVariantStyleId',
    },
  },
  UniqueImageName: {
    type: DataTypes.STRING(250),
  },
  ImageType: {
    type: DataTypes.STRING(50),
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
  IconImagePath: {
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
  schema: 'icon',
  timestamps: false,
  tableName: 'IconImage',
});

export default IconImage;

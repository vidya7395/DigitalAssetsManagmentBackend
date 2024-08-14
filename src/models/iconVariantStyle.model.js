import { DataTypes } from "sequelize"
import sequelize from "../db/index.js"
import Icon from "./icon.model.js"
import Variant from "./variant.model.js"
import Style from "./style.model.js"

const IconVariantStyle = sequelize.define('IconVariantStyle', {
    IconVariantStyleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    StyleId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:Style,
            key:'StyleId'
        }
    },
    VariantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:Variant,
            key:'VariantId'
        }
    },
    IconId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:Icon,
            key:'IconId'
        }
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
    tableName: 'IconVariantStyle',

    timestamps: false,
})

export default IconVariantStyle
import { DataTypes } from "sequelize"
import sequelize from "../db/index.js"
import Icon from "./icon.model.js"
import Variant from "./variant.model.js"

const IconVariant = sequelize.define('IconVariant', {
    IconVariantId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    timestamps: false,
    tableName: 'IconVariant',
})

export default IconVariant
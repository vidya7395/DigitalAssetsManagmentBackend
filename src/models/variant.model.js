import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Variant = sequelize.define('Variant', {
    VariantId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    VariantName: {
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
    schema: 'ref',
    timestamps: false,
    tableName: 'Variant',
})
export default Variant;
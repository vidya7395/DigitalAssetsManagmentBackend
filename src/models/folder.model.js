import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';
import Project from './project.model.js';
const Folder = sequelize.define('Folder', {
    FolderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ParentFolderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Folder',
            key: 'FolderId'
        }
    },
    FolderName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    ProjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Project,
            key: 'ProjectId'
        }
    },
    isDefaultFolder: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    CreatedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.DATE.NOW,
    },
    ModifiedDate: {
        type: DataTypes.DATE,
    },
    ModifiedBy: {
        type: DataTypes.STRING(255),
    },
    DeletedDate: {
        type: DataTypes.DATE,
    },
    DeletedBy: {
        type: DataTypes.STRING(255),
    }
}, {
    schema: 'project',
    timestamps: false,
    tableName: 'Folder',
});

export default Folder;

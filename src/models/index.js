import Category from './category.model.js';
import Icon from './icon.model.js';
import IconImage from './iconImage.model.js'

import IconStyle from './iconStyle.model.js';
import Project from './project.model.js';
import Style from './style.model.js';
import Tag from './tag.model.js';
import IconCategory from './iconCategory.model.js';
import IconTag from './iconTag.model.js';
import Folder from './folder.model.js';
// import IconVariant from './iconVariant.model.js';
import Variant from './variant.model.js';
import IconVariantStyle from './iconVariantStyle.model.js';

Icon.belongsTo(Project, { foreignKey: 'ProjectId' });
Project.hasMany(Icon, { foreignKey: 'ProjectId' });

Icon.belongsTo(Folder, { foreignKey: 'FolderId' });
Folder.hasMany(Icon, { foreignKey: 'FolderId' });

IconCategory.belongsTo(Icon, { foreignKey: 'IconId' });
IconCategory.belongsTo(Category, { foreignKey: 'CategoryId' });

Icon.hasMany(IconCategory, { foreignKey: 'IconId' });
Category.hasMany(IconCategory, { foreignKey: 'CategoryId' });

IconImage.belongsTo(Icon, { foreignKey: 'IconId' });
Icon.hasMany(IconImage, { foreignKey: 'IconId' });

IconStyle.belongsTo(Icon, { foreignKey: 'IconId' });
IconStyle.belongsTo(Style, { foreignKey: 'StyleId' });

Icon.hasMany(IconStyle, { foreignKey: 'IconId' });
Style.hasMany(IconStyle, { foreignKey: 'StyleId' });

IconTag.belongsTo(Icon, { foreignKey: 'IconId' });
IconTag.belongsTo(Tag, { foreignKey: 'TagId' });

Icon.hasMany(IconTag, { foreignKey: 'IconId' });
Tag.hasMany(IconTag, { foreignKey: 'TagId' });

// IconVariant.belongsTo(Icon, { foreignKey: 'IconId' });
// IconVariant.belongsTo(Variant, { foreignKey: 'VariantId' });

// Icon.hasMany(IconVariant, { foreignKey: 'IconId' });
// Variant.hasMany(IconVariant, { foreignKey: 'VariantId' });

// IconVariantStyle.belongsTo(IconVariant, { foreignKey: 'IconVariantId' });
IconVariantStyle.belongsTo(Style, { foreignKey: 'StyleId' });

// IconVariant.hasMany(IconVariantStyle, { foreignKey: 'IconVariantId' });
Style.hasMany(IconVariantStyle, { foreignKey: 'StyleId' });

Folder.belongsTo(Project, { foreignKey: 'ProjectId' });
Project.hasMany(Folder, { foreignKey: 'ProjectId' });

Folder.belongsTo(Folder, { as: 'ParentFolder', foreignKey: 'ParentFolderId' });
Folder.hasMany(Folder, { as: 'SubFolders', foreignKey: 'ParentFolderId' });

Icon.hasMany(IconVariantStyle, { foreignKey: 'IconId' });
IconVariantStyle.belongsTo(Icon, { foreignKey: 'IconId' });

IconVariantStyle.hasMany(IconImage, { foreignKey: 'IconVariantStyleId' });
IconImage.belongsTo(IconVariantStyle, { foreignKey: 'IconVariantStyleId' });



const models = {
    Category,
    Icon,
    IconCategory,
    IconImage,
    IconStyle,
    IconTag,
    Project,
    Style,
    Tag,
    Variant,
    Folder,
    // IconVariant,
    IconVariantStyle
};


export default models;

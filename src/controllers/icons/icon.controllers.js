import chalk from "chalk";
import Icon from "../../models/icon.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import IconVariantStyle from "../../models/iconVariantStyle.model.js";
import IconImage from "../../models/iconImage.model.js";
import { v4 as uuidv4 } from 'uuid'; // Use uuidv4 for generating unique IDs
import { Sequelize } from "sequelize";
import path from 'path';
import Style from "../../models/style.model.js";
import { uploadOnClodinary } from "../../utils/cloudinary.js";
import Project from "../../models/project.model.js";
import sequelize from "../../db/index.js";
import Category from "../../models/category.model.js";
import Variant from "../../models/variant.model.js";
import Tag from "../../models/tag.model.js";
import IconTag from "../../models/iconTag.model.js";
import IconCategory from "../../models/iconCategory.model.js";

const addIcon = asyncHandler(async (req, res) => {
  console.log("called", req.body);

  const transaction = await sequelize.transaction();

  try {
    const { iconName: IconName, projectId: ProjectId, folderId: FolderId, variants, tag, categoryId } = req.body;

    // Validate inputs
    if (!IconName || !ProjectId || !FolderId || !variants || !tag || !categoryId) {
      return res.status(400).json(new ApiResponse(400, 'Missing required fields', null));
    }
    console.log("First Step");
    // Check for existing icon with the same name
    const existingIcon = await Icon.findOne({
      where: { ProjectId, FolderId, IconName },
      transaction,
    });

    if (existingIcon) {
      return res.status(400).json(new ApiResponse(400, 'Icon name must be unique', null));
    }
    // Fetch category data
    const categoryData = await Category.findOne({ where: { CategoryId: categoryId }, transaction });
    if (!categoryData) {
      return res.status(400).json(new ApiResponse(400, 'Invalid Category ID', null));
    }

    let newIcon;
    try {
      newIcon = await Icon.create({
        IconName: `${IconName}`,
        ProjectId,
        FolderId,
        CreatedDate: Sequelize.Sequelize.fn('getdate'),
      }, { transaction });
    } catch (error) {
      throw new ApiError(500, '---Failed to create Icon record', error);

    }
    console.log("Second Step: Icon Created", newIcon.IconId);
    //add Category data
    try {
       await IconCategory.create({
        CategoryId: categoryData.CategoryId,
        IconId: newIcon.IconId,
        CreatedDate: Sequelize.Sequelize.fn('getdate'),
      }, { transaction });
    } catch (error) {
      throw new ApiError(500, 'Failed to create Icon record', error);
    }
    console.log(chalk.bgCyan('Icon Record Created', newIcon.IconId));

    // Process each variant
    for (let i = 0; i < variants.length; i++) {
      const { variantId, styleId } = variants[i];

      // Validate variant and style IDs
      if (!variantId || !styleId) {
        return res.status(400).json(new ApiResponse(400, `Missing variantId or styleId for variant ${i + 1}`, null));
      }

      // Find the corresponding file for the variant and style
      const fileFieldName = `variants[${i}][file]`;
      const file = req.files.find(f => f.fieldname === fileFieldName);

      if (!file) {
        return res.status(400).json(new ApiResponse(400, `Image file is missing for variant ${variantId} and style ${styleId}`, null));
      }

      // Fetch Variant and Style data
      const variantData = await Variant.findOne({ where: { VariantId: variantId }, transaction });
      if (!variantData) {
        return res.status(400).json(new ApiResponse(400, `Invalid Variant ID: ${variantId}`, null));
      }

      const styleData = await Style.findOne({ where: { StyleId: styleId }, transaction });
      if (!styleData) {
        return res.status(400).json(new ApiResponse(400, `Invalid Style ID: ${styleId}`, null));
      }

      // Upload the image to cloud storage
      const iconLocalPath = file.path;
      const iconFilePath = await uploadOnClodinary(iconLocalPath);

      if (!iconFilePath || !iconFilePath.url) {
        throw new ApiError(400, 'Image upload failed');
      }

      // Create new VariantsSTyle

      let newIconVarinatStyle;
      console.log("IconId", newIcon.IconId, "VariantId", variantData.VariantId, "StyleId", styleData.StyleId);

      try {
        newIconVarinatStyle = await IconVariantStyle.create({
          IconId: newIcon.IconId,
          VariantId: variantData.VariantId,
          StyleId: styleData.StyleId,
          CreatedDate: Sequelize.Sequelize.fn('getdate'),
        }, { transaction });
      } catch (error) {
        throw new ApiError(500, 'Failed to create IconVariantStyle record', error);
      }

      // Create IconImage record




      try {
        await IconImage.create({
          ImageName: `${newIcon.IconName}-${variantData.VariantName}-${styleData.StyleName}`,
          IconId: newIcon.IconId,
          UniqueImageName: uuidv4() + path.extname(file.originalname),
          ImageType: file.mimetype,
          IconImagePath: iconFilePath.url,
          IconVariantStyleId: newIconVarinatStyle.IconVariantStyleId,
          CreatedDate: Sequelize.Sequelize.fn('getdate'),
        }, { transaction });
      } catch (error) {
        throw new ApiError(500, 'Failed to create IconImage record', error);
      }
      console.log("New Icon Image Created");

    }

    // Handle Tags
    const tagsArray = tag.split(',');
    for (let tagName of tagsArray) {
      let existingTag = await Tag.findOne({ where: { TagName: tagName }, transaction });

      if (!existingTag) {
        existingTag = await Tag.create({
          TagName: tagName,
          CreatedDate: Sequelize.Sequelize.fn('getdate'),
        }, { transaction });

        if (!existingTag) {
          throw new ApiError(500, `Failed to create Tag: ${tagName}`);
        }
      }

      // Associate the tag with the new icon
      let newIconTag;
      try {
        newIconTag = await IconTag.create({
          IconId: newIcon.IconId,
          TagId: existingTag.TagId,
          CreatedDate: Sequelize.Sequelize.fn('getdate'),
        }, { transaction });
      } catch (error) {
        throw new ApiError(500, `Failed to create IconTag association for tag: ${tagName}`);

      }

      if (!newIconTag) {
        throw new ApiError(500, `Failed to create IconTag association for tag: ${tagName}`);
      }
    }

    console.log(chalk.bgCyan('IconImage Record Created'));
    // Commit transaction
    await transaction.commit();
    return res.status(201).json(new ApiResponse(201, 'Icon added successfully', null));
  } catch (error) {
    console.error(chalk.red('Error in addIcon function:', error));

    // Rollback transaction in case of an error
    if (transaction) await transaction.rollback();

    return res.status(500).json(new ApiResponse(500, 'Internal Server Error', error.message));
  }
});
// an API to get the list of icons from specific project from project id and folder id
//and return the list of icons with their variant style id 1 and style id 1 and images
const getIconList = asyncHandler(async (req, res, next) => {
  console.log("params", req.params);

  try {
    const { projectId, folderId } = req.params;
    const { Page = 0, PerPage = 5, q = '', sort = '' } = req.query;

    const limit = parseInt(PerPage, 10) || 5;
    const offset = parseInt(Page, 10) * limit;

    const whereClause = {
      ProjectId: projectId,
      FolderId: folderId,
      DeletedDate: null,
      ...(q && { IconName: { [Sequelize.Op.like]: `%${q}%` } })
    };

    const orderClause = sort ? [sort.split(',')] : [['IconName', 'ASC']];

    const icons = await Icon.findAll({
      where: whereClause,
      attributes: { exclude: ['CreatedDate', 'DeletedDate', 'ModifiedDate', 'CreatedBy', 'ModifiedBy', 'DeletedBy'] },
      include: [
        {
          model: IconVariantStyle,
          // where:[{VariantId:1,StyleId:1}],
          attributes: { exclude: ['CreatedDate', 'DeletedDate', 'ModifiedDate', 'CreatedBy', 'ModifiedBy', 'DeletedBy'] },
          include: [
            {
              model: IconImage,
              attributes: { exclude: ['CreatedDate', 'DeletedDate', 'ModifiedDate', 'CreatedBy', 'ModifiedBy', 'DeletedBy'] },
            }
          ]
        },

      ],
      limit: limit,
      offset: offset,
      order: orderClause
    });
    const projectName = await Project.findOne({
      where: {
        ProjectId: projectId,
      }
    });
    //categoryId

    const transformedIcons = icons.map(icon => ({
      iconId: icon.IconId,
      iconName: icon.IconName,
      categoryId: icon.CategoryId,
      data: icon.IconVariantStyles.map(variantStyle => ({
        styleId: variantStyle.StyleId,
        variantId: variantStyle.VariantId,
        iconImagePath: variantStyle.IconImages[0]?.IconImagePath || null,
        imageName: variantStyle.IconImages[0]?.ImageName || null,
      }))
    }));

    const data = {
      totalCount: icons.length,
      projectName: projectName.ProjectName,
      icons: transformedIcons
    };

    return res.status(200).json(new ApiResponse(200, 'Icon list retrieved successfully', data));
  } catch (error) {
    console.error("Error while retrieving icons:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const deleteIcon = asyncHandler(async (req, res, next) => {
  try {
    const { iconId } = req.params.iconId;
    const icon = await Icon.findByPk(iconId);

    if (!icon) {
      return res.status(404).json(new ApiResponse(404, 'Icon not found', null));
    }

    icon.DeletedDate = Sequelize.Sequelize.fn('getdate');
    await icon.save();

    return res.status(200).json(new ApiResponse(200, 'Icon deleted successfully', null));
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error in addIcon function:', error);
    throw new ApiError(500, 'Internal Server Error', error.message);
  } finally {
    if (transaction) await transaction.commit();
  }
});

export {
  addIcon,
  getIconList,
  deleteIcon
}
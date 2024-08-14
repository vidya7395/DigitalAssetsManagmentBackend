import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 1433, // Default port for SQL Server
  dialect: 'mssql',
  logging: false,
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true,
      useUTC: false, // Disabling UTC to ensure the date is stored in the correct format
      dateFirst: 1,  // Setting the first day of the week to Monday
      connectTimeout: 30000, // Timeout after 30 seconds if connection cannot be established
    }
  },
  pool: {
    max: 10, // Maximum number of connections in the pool
    min: 2,  // Minimum number of connections in the pool
    acquire: 60000, // Maximum time (in ms) that pool will try to get connection before throwing error
    idle: 10000, // Maximum time (in ms) that a connection can be idle before being released
  },
  retry: {
    match: [
      /ESOCKET/,
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ENOTFOUND/
    ],
    max: 5 // Maximum number of retries
  }
});

export default sequelize;
/*

const addIcon = asyncHandler(async (req, res) => {
  console.log("called");
  
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
      throw new ApiError(500, 'Failed to create Icon record', error);

    }
    console.log(chalk.bgCyan('Icon Record Created',newIcon.IconId));
    
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




      let newIconImage;
      try {
        newIconImage = await IconImage.create({
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
    let iconVarinatStyle
    try {
      iconVarinatStyle = await IconVariantStyle.create({
        IconId: newIcon.IconId,
        VariantId: variantData.VariantId,
        StyleId: styleData.StyleId,
        CreatedDate: Sequelize.Sequelize.fn('getdate'),
      })
    } catch (error) {
      throw new ApiError(500, 'Failed to create IconVariantStyle record', error);
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

*/
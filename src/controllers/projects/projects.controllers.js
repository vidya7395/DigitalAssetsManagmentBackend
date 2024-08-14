import chalk from "chalk";
import Project from "../../models/project.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Use uuidv4 for generating unique IDs
import { Op, Sequelize } from "sequelize";
import { uploadOnClodinary } from "../../utils/cloudinary.js";
import Folder from "../../models/folder.model.js";

const getProjectList = asyncHandler(async (req, res) => {
    try {
        const { Page = 0, PerPage = 5, q = '', sort = '' } = req.query;

        // Calculate offset and limit
        const limit = parseInt(PerPage, 10) || 5;
        const offset = parseInt(Page, 10) * limit;

        // Construct the where clause for search query and excluding soft-deleted projects
        const whereClause = {
            DeletedDate: null, // Exclude soft-deleted projects
            ...(q && {
                ProjectName: {
                    [Op.like]: `%${q}%`
                }
            })
        };

        // Construct the order clause for sorting
        const orderClause = sort ? [sort.split(',')] : [['ProjectName', 'ASC']]; // Default sorting by ProjectName

        // Fetch projects with pagination and filtering
        const projects = await Project.findAll({
            where: whereClause,
            order: orderClause,
            limit: limit,
            offset: offset,
            attributes: { exclude: ['CreatedDate','DeletedDate','ModifiedDate','CreatedBy','ModifiedBy','DeletedBy'] }
        });
        //get folder data relatd to projectId
        const folderData = await Folder.findAll({
            where: {
                ProjectId: projects.map(project => project.ProjectId),
            },
            attributes: { exclude: ['CreatedDate','DeletedDate','ModifiedDate','CreatedBy','ModifiedBy','DeletedBy'] }
        });
        const formattedProjects = projects.map(project => {
            const projectFolders = folderData
            .filter(folder => folder.ProjectId === project.ProjectId)
            .map(folder => folder.FolderId);
            return {
                projectName: project.ProjectName,
                projectLogo: project.ProjectLogo,
                projectId: project.ProjectId,
                uniqueImageName: project.UniqueImageName,
                imageType: project.ImageType,
                projectImagePath: project.ProjectImagePath,
                folderId: projectFolders.length === 1 ? projectFolders[0] : projectFolders 

            };
        });
        const data = {
            totalCount: projects.length,
            projects: formattedProjects
        };
        // Send response
        return res.status(200).json(new ApiResponse(200, "Projects retrieved successfully",data));

    } catch (error) {
        console.error(chalk.red(error.message));
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const addProject = asyncHandler(async (req, res) => {
    const { projectName } = req.body;
    if (!projectName) {
        throw new ApiError(400, "Project name is required");
    }
    const existedProjectName = await Project.findOne({ 
        where: { 
          ProjectName: projectName,
          DeletedDate: {
            [Op.like]: null
          }
        }
      });
    if (existedProjectName) {
        throw new ApiError(400, chalk.bgCyan("Project name already exists"));

    }
    let projectLocalPath;
    console.log("Requested local files",req.files);
    
    if (req.files && Array.isArray(req.files.projectLogo) && req.files.projectLogo.length > 0) {
        projectLocalPath = req.files.projectLogo[0].path;
    }
    else {
        // throw new ApiError(400, "Project logo is required");
        throw new ApiError(400, ("Project logo is required"));
    }
    const projectLogo = await uploadOnClodinary(projectLocalPath);
    if (!projectLogo) {
        throw new ApiError(400, "Project logo is required");
    }
    console.log("project Data", req.files.projectLogo[0]);
    const uniqueImageName = uuidv4() + path.extname(req.files.projectLogo[0].originalname);
    const imageType = path.extname(req.files.projectLogo[0].originalname);
    
    try {
        const project = await Project.create({
            ProjectName: projectName,
            ProjectLogo: projectLogo.url,
            UniqueImageName: uniqueImageName,
            ImageType: imageType,
            ProjectImagePath: projectLogo.url,
        });
        console.log("Project created successfully", project);
        //for every project created , add it to a folder in database
         try {
            const folder = await Folder.create({
                FolderName: projectName,
                ProjectId: project.ProjectId,
                isDefaultFolder: true
            });
            console.log("Folder created successfully", folder);

        } catch (error) {
            console.error("Error during folder creation:", error);
            throw new ApiError(500, "An error occurred while creating the folder", error);
        }

        const { ModifiedDate,DeletedDate,CreatedBy,ModifiedBy,DeletedBy, ...projectData } = project.dataValues;

        return res
            .status(200)
            .json(new ApiResponse(201,  "Project created successfully",projectData));
    } catch (error) {
        console.error("Error during project creation:", error);
        throw new ApiError(500, "An error occurred while creating the project", error);
    }
});

const deleteProject = asyncHandler(async (req, res) => {
    const  projectId  = parseInt(req.params.projectId);
    if (!projectId) {
        // throw new ApiError(400, "Project ID is required");
        return new ApiResponse(400, "Project ID is required");
    }
    const project = await Project.findByPk(projectId);
    if (!project) {
        return new ApiResponse(404, "Project not found");
    }
    try {
        // Soft delete by setting the deletedAt column
        await Project.update({ DeletedDate: Sequelize.Sequelize.fn('getdate') }, { where: { ProjectId: projectId } });
      
        return res
            .status(200)
            .json(new ApiResponse(200, "Project deleted successfully"));
    } catch (error) {
        console.error(chalk.red("Error during project deletion:", error));
        throw new ApiError(500, "An error occurred while deleting the project", error);
    }
});
export {
    getProjectList,
    addProject,
    deleteProject
}
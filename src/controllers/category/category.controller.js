import Category from "../../models/category.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getCategory = asyncHandler(async (req, res) => {  
    try {
        const categories = await Category.findAll({
            attributes: { exclude: ['CreatedDate','DeletedDate','ModifiedDate'] }
        });
        const formattedCategories = categories.map(category => {
            return {
                categoryName: category.CategoryName,
                categoryId: category.CategoryId,
            };
        });
        return res
            .status(200)
            .json(new ApiResponse(200, "Categories retrieved successfully",formattedCategories));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500,  "Error retrieving Categories", error));
    }

  });

  export {
    getCategory  }
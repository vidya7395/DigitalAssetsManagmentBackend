import Variant from "../../models/variant.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getVariants = asyncHandler(async (req, res) => {  
    try {
        const variants = await Variant.findAll({
            attributes: { exclude: ['CreatedDate','DeletedDate','ModifiedDate'] }
        });
        return res
            .status(200)
            .json(new ApiResponse(200, "Varinats retrieved successfully",variants));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500,  "Error retrieving styles", error));
    }

  });

  export {
    getVariants
  }
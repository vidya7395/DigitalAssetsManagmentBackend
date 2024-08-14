import Style from "../../models/style.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getStyles = asyncHandler(async (req, res) => {  
    try {
        const styles = await Style.findAll({
            attributes: { exclude: ['CreatedDate','DeletedDate','ModifiedDate'] }
        });
        const formattedData = styles.map(style => {
            return {
                styleName: style.StyleName,
                styleId: style.StyleId,
            };
        });
        return res
            .status(200)
            .json(new ApiResponse(200, "Styles retrieved successfully",formattedData));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500,  "Error retrieving styles", error));
    }

  });

  export {
    getStyles
  }
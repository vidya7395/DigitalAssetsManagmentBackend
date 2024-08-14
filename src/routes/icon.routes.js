import { Router } from "express";
import { addIcon, deleteIcon, getIconList } from "../controllers/icons/icon.controllers.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
router.route("/add-icon").post(upload.any(), addIcon);
router.route("/get-icon-list/:folderId/:projectId").get(getIconList);
router.route("/delete-icon/:iconId").delete(deleteIcon);

export default router;
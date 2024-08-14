
import { Router } from "express";
import { addProject, deleteProject, getProjectList } from "../controllers/projects/projects.controllers.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
router.route("").post(upload.fields([{
    name:"projectLogo",
    maxCount:1
}]), addProject);
router.route("/search").post(getProjectList);
router.route("/delete-project/:projectId").delete(deleteProject);


export default router;
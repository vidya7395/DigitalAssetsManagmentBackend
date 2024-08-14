import { Router } from "express";
import { getCategory } from "../controllers/category/category.controller.js";

const router = Router();
router.route("").get(getCategory);

export default router;
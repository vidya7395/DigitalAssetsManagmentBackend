import { Router } from "express";
import { getStyles } from "../controllers/styles/style.controllers.js";

const router = Router();
router.route("").get(getStyles);

export default router;
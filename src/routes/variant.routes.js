import { Router } from "express";
import { getVariants } from "../controllers/variant/variant.controller.js";

const router = Router();
router.route("").get(getVariants);

export default router;
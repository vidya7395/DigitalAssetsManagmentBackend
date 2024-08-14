import { Router } from "express";
import { convertSvgToReactAndCreateTar } from "../controllers/svgToReact/svgToReact.controllers.js";

const router = Router();
router.route("").get(convertSvgToReactAndCreateTar);

export default router;
import { Router } from "express";
import { listScreens, toggleScreen } from "../controllers/screen.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);
router.get("/", listScreens);
router.put("/:id", requireRole(["EDITOR", "ADMIN"]), toggleScreen);
export default router;

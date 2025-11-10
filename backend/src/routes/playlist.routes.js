import { Router } from "express";
import { body } from "express-validator";
import { listPlaylists, createPlaylist } from "../controllers/playlist.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);

router.get("/", listPlaylists);
router.post("/",
  requireRole(["EDITOR", "ADMIN"]),
  [
    body("name").isString().trim().isLength({ min: 1 }).withMessage("name is required"),
    body("itemUrls").optional().isArray({ max: 10 }).withMessage("itemUrls must be an array up to 10"),
    body("itemUrls.*").optional().isURL().withMessage("each itemUrls entry must be a valid URL")
  ],
  createPlaylist
);
export default router;

import { Router } from "express";
import { body } from "express-validator";
import { login } from "../controllers/auth.controller.js";

const router = Router();
router.post("/login",
  [ body("email").isEmail().withMessage("Valid email required"),
    body("password").isString().isLength({ min: 6 }).withMessage("Password required") ],
  login
);
export default router;

import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import userSchema from "../schemas/userSchema.js";
import loginSchema from "../schemas/loginSchema.js";
import {
  handleLogin,
  handleLogout,
  postUser,
  handleRefreshToken,
} from "../controllers/authController.js";

const router = Router();

router.post("/signin", schemaValidator(loginSchema), handleLogin);
router.post("/signup", schemaValidator(userSchema), postUser);
router.post("/logout", handleLogout);
router.get("/refresh", handleRefreshToken);
export default router;

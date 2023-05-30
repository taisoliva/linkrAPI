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

const authRouter = Router();

authRouter.post("/signin", schemaValidator(loginSchema), handleLogin);
authRouter.post("/signup", schemaValidator(userSchema), postUser);
authRouter.post("/logout", handleLogout);
authRouter.get("/refresh", handleRefreshToken);
export default authRouter;

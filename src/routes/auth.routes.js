import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import userSchema from "../schemas/user.Schema.js";
import loginSchema from "../schemas/login.Schema.js";
import {
  handleLogin,
  handleLogout,
  postUser,
  handleRefreshToken,
  handleRefreshTokenWithoutJWT,
} from "../controllers/auth.Controller.js";

const authRouter = Router();

authRouter.post("/signin", schemaValidator(loginSchema), handleLogin);
authRouter.post("/signup", schemaValidator(userSchema), postUser);
authRouter.post("/logout", handleLogout);
authRouter.get("/refresh", handleRefreshToken);
authRouter.get("/refreshnojwt", handleRefreshTokenWithoutJWT);
export default authRouter;

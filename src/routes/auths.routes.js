import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import userSchema from "../schemas/user.schema.js";
import loginSchema from "../schemas/login.schema.js";
import {
  handleLogin,
  handleLogout,
  postUser,
  handleRefreshToken,
  handleRefreshTokenWithoutJWT,
  postCheckCookies,
  getCheckCookies,
} from "../controllers/auths.controller.js";

const authRouter = Router();

authRouter.post("/signin", schemaValidator(loginSchema), handleLogin);
authRouter.post("/signup", schemaValidator(userSchema), postUser);
authRouter.post("/logout", handleLogout);
authRouter.get("/refresh", handleRefreshToken);
authRouter.get("/refreshnojwt", handleRefreshTokenWithoutJWT);
authRouter.post("/check-cookies", postCheckCookies);
authRouter.get("/check-cookies", getCheckCookies);
export default authRouter;
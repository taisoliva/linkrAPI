import { Router } from "express";
import { validateIdAsParams } from "../middlewares/validateParams.js";
import { getUserProfileById } from "../controllers/users.controller.js";
import verfifyJWT from "../middlewares/verifyJWT.js";

const usersRouter = Router();

usersRouter.get("/user/:id", validateIdAsParams, getUserProfileById);

export default usersRouter;
import { Router } from "express";
import { validateIdAsParams } from "../middlewares/validateParams.js";
import { getUserProfileById, getUserByName } from "../controllers/users.controller.js";
import verfifyJWT from "../middlewares/verifyJWT.js";

const usersRouter = Router();

usersRouter.get("/getById/:id", verfifyJWT, validateIdAsParams, getUserProfileById);
usersRouter.get("/getByName/:name", verfifyJWT, getUserByName);

export default usersRouter;
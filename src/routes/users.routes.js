import { Router } from "express";
import { validateIdAsParams } from "../middlewares/validateParams.js";
import { getUserProfileById, getUserByName, logout } from "../controllers/users.controller.js";
import verfifyJWT from "../middlewares/verifyJWT.js";

const usersRouter = Router();

usersRouter.get("/getById/:id", verfifyJWT, validateIdAsParams, getUserProfileById);
usersRouter.get("/getByName/:name", verfifyJWT, getUserByName);
usersRouter.get("/logout", verfifyJWT, logout);


export default usersRouter;

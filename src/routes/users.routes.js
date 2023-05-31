import { Router } from "express";
import { validateIdAsParams } from "../middlewares/validateParams.js";
import { getUserProfileById, logout } from "../controllers/users.controller.js";
import { getUserProfileById, getUserByName } from "../controllers/users.controller.js";
import verfifyJWT from "../middlewares/verifyJWT.js";

const usersRouter = Router();

usersRouter.get("/user/:id", verfifyJWT, validateIdAsParams, getUserProfileById);
usersRouter.post("/logout", verfifyJWT, logout);

usersRouter.get("/getById/:id", verfifyJWT, validateIdAsParams, getUserProfileById);
usersRouter.get("/getByName/:name", verfifyJWT, getUserByName);


export default usersRouter;
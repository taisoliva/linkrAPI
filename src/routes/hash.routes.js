import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.js";

const postsRouter = Router();

postsRouter.put("/hash", verifyJWT, editPost);
postsRouter.delete("/hash/:hash", verifyJWT, deletePost);

export default postsRouter;

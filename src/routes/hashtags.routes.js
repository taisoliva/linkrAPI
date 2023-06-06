import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import { getHashRank, getHashDetail } from "../controllers/hash.controller.js";
import { validateStringParam } from "../middlewares/validateStringParam.js";
const postsRouter = Router();

postsRouter.get("/", verifyJWT, getHashRank);
postsRouter.get("/:hash", verifyJWT, getHashDetail);

export default postsRouter;

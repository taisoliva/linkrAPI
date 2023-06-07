import { Router } from "express";
import { follow, unfollow } from "../controllers/follows.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import id from "../schemas/id.schema.js";
import verfifyJWT from "../middlewares/verifyJWT.js";

const followRouter = Router();

followRouter.post("/follow", verfifyJWT, schemaValidator(id), follow);
followRouter.post("/unfollow", verfifyJWT, schemaValidator(id), unfollow);

export default followRouter;

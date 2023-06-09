import { Router } from "express";
import { follow, unfollow, following } from "../controllers/follows.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import id from "../schemas/id.schema.js";
import verfifyJWT from "../middlewares/verifyJWT.js";

const followRouter = Router();

followRouter.post("/follow", verfifyJWT, schemaValidator(id), follow);
followRouter.post("/unfollow", verfifyJWT, schemaValidator(id), unfollow);
followRouter.get("/checkfollowing", verfifyJWT, schemaValidator(id), following);

export default followRouter;

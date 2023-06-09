import { Router } from "express";
import {
  follow,
  unfollow, following,
  getFollows,
} from "../controllers/follows.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import id from "../schemas/id.schema.js";
import verfifyJWT from "../middlewares/verifyJWT.js";
import { validateIdAsParams } from "../middlewares/validateParams.js";

const followRouter = Router();

followRouter.use(verfifyJWT);
followRouter.get("/", getFollows);
followRouter.post("/follow", schemaValidator(id), follow);
followRouter.post("/unfollow", schemaValidator(id), unfollow);
followRouter.get("/checkfollowing/:id", validateIdAsParams, following);

export default followRouter;

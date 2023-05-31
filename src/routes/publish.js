import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { getPost, publishPost } from "../controllers/publishController.js";
import publishShema from "../schemas/publishSchema.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const publishRouter = Router()


publishRouter.post("/post", verifyJWT ,schemaValidator(publishShema),publishPost)
publishRouter.get("/post", getPost)
export default publishRouter
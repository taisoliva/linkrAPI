import { Router } from "express";
import { validateIdAsParams } from "../middlewares/validateParams.js";
import { editPost, deletePost, getPost, publishPost } from "../controllers/posts.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import editPostSchema from "../schemas/hash.schema.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import publishShema from "../schemas/publish.Schema.js";

const postsRouter = Router();

postsRouter.put("/edit/:id", verifyJWT, validateIdAsParams, schemaValidator(editPostSchema), editPost);
postsRouter.delete("/delete/:id", verifyJWT, validateIdAsParams, deletePost);
postsRouter.post("/", verifyJWT ,schemaValidator(publishShema),publishPost)
postsRouter.get("/", getPost)

export default postsRouter;
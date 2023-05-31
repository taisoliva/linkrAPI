import { Router } from "express";
import { validateIdAsParams } from "../middlewares/validateParams.js";
import { editPost, deletePost } from "../controllers/posts.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import editPostSchema from "../schemas/editPost.schema.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const postsRouter = Router();

postsRouter.put("/posts/edit/:id", verifyJWT, validateIdAsParams, schemaValidator(editPostSchema), editPost);
postsRouter.delete("/posts/delete/:id", verifyJWT, validateIdAsParams, deletePost);

export default postsRouter;
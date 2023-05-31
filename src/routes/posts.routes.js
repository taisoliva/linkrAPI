import { Router } from "express";
import { validateIdAsParams } from "../middlewares/validateParams.js";
import { editPost, deletePost } from "../controllers/posts.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import editPostSchema from "../schemas/hash.schema.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const postsRouter = Router();

postsRouter.put("/edit/:id", verifyJWT, validateIdAsParams, schemaValidator(editPostSchema), editPost);
postsRouter.delete("/delete/:id", verifyJWT, validateIdAsParams, deletePost);

export default postsRouter;
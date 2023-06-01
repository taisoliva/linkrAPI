import { Router } from "express";
import { validateIdAsParams } from "../middlewares/validateParams.js";
import { editPost, deletePost, likedPost, disLikedPost } from "../controllers/posts.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import editPostSchema from "../schemas/hash.schema.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const postsRouter = Router();

postsRouter.put("/edit/:id", verifyJWT, validateIdAsParams, schemaValidator(editPostSchema), editPost);
postsRouter.delete("/delete/:id", verifyJWT, validateIdAsParams, deletePost);
postsRouter.post("/likes/:id", verifyJWT, validateIdAsParams, likedPost)
postsRouter.post("/disliked/:id", verifyJWT, validateIdAsParams, disLikedPost)


export default postsRouter;
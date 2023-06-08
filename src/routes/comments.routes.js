import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import commentSchema from "../schemas/comment.schema.js";
import { getCommentsWithPostId, postComment } from "../controllers/comments.controller.js";
import { validateIdAsParams } from "../middlewares/validateParams.js";

const commentsRoutes = Router();

commentsRoutes.use(verifyJWT)
commentsRoutes.get("/:id", validateIdAsParams, getCommentsWithPostId);
commentsRoutes.post("/", schemaValidator(commentSchema), postComment);

export default commentsRoutes;


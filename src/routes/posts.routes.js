import { Router } from "express";
import { validateIdAsParams } from "../middlewares/validateParams.js";
import {
  editPost,
  deletePost,
  getPost,
  publishPost,
  likedPost,
  disLikedPost,
  verifyLikes,
  whoLiked,
  getPostsV2,
} from "../controllers/posts.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import editPostSchema from "../schemas/hash.schema.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import publishShema from "../schemas/publish.Schema.js";

const postsRouter = Router();

postsRouter.put(
  "/edit/:id",
  verifyJWT,
  validateIdAsParams,
  schemaValidator(editPostSchema),
  editPost
);
postsRouter.delete("/delete/:id", verifyJWT, validateIdAsParams, deletePost);

postsRouter.post("/likes/:id", verifyJWT, validateIdAsParams, likedPost);
postsRouter.post("/disliked/:id", verifyJWT, validateIdAsParams, disLikedPost);

// ********************************************************** //
/* */ postsRouter.get("/isliked", verifyJWT, verifyLikes); /* */
/* */ postsRouter.get("/liked/:id", verifyJWT, whoLiked);  /* */
/* */ postsRouter.get("/", getPost);                       /* */
// ********************************************************** //
/* */ postsRouter.get("/v2", verifyJWT, getPostsV2);       /* */
// ********************************************************** //

postsRouter.post("/", verifyJWT, schemaValidator(publishShema), publishPost);

export default postsRouter;

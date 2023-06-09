import { Router } from "express";
import { validateIdAsParams } from "../middlewares/validateParams.js";
import {
  editPost,
  deletePost,
  publishPost,
  likedPost,
  disLikedPost,
  getPost,
  postShare,
  publishRepost,
  checkNewPosts
} from "../controllers/posts.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import editPostSchema from "../schemas/hashtag.schema.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import publishShema from "../schemas/publish.schema.js";

const postsRouter = Router();

postsRouter.put(
  "/edit/:id",
  verifyJWT,
  validateIdAsParams,
  schemaValidator(editPostSchema),
  editPost
);
postsRouter.delete("/delete/:id", verifyJWT, validateIdAsParams, deletePost);

postsRouter.post("/", verifyJWT, schemaValidator(publishShema), publishPost);
postsRouter.post("/repost", verifyJWT, publishRepost);
postsRouter.post("/likes/:id", verifyJWT, validateIdAsParams, likedPost);
postsRouter.post("/disliked/:id", verifyJWT, validateIdAsParams, disLikedPost);

postsRouter.post("/share/:id", verifyJWT, postShare);
postsRouter.get("/:offset", verifyJWT, getPost);
postsRouter.get("/newPosts/:last", verifyJWT, checkNewPosts);



export default postsRouter;

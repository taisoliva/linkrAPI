import { Router } from "express";
import usersRouter from "./users.routes.js";
import authRouter from "./auth.routes.js";
import postsRouter from "./posts.routes.js";
import hashtagsRouter from "./hashtags.routes.js";
import followRouter from "./follow.routes.js";

const router = Router();

router.use("/", authRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/hashtags", hashtagsRouter);
router.use(followRouter);

export default router;
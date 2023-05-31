import { Router } from "express";
import usersRouter from "./users.routes.js";
import authRouter from "./auth.js";
import publishRouter from "./publish.js";
import postsRouter from "./posts.routes.js";

const router = Router();

router.use(usersRouter);
router.use("/" ,authRouter);
router.use("/publish", publishRouter)
router.use(postsRouter);

export default router;
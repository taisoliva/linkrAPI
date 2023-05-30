import { Router } from "express";
import usersRouter from "./users.routes.js";
import authRouter from "./auth.js";

const router = Router();

router.use(usersRouter);
<<<<<<< HEAD
router.use("/" ,authRouter);
=======
router.use(authRouter);
>>>>>>> 40b4d7c (feat/ user/:id route)

export default router;
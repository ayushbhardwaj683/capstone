import { Router } from "express";
import { authRouter } from "./auth.routes";
import { formRouter, publicFormRouter } from "./form.routes";
import { responseRouter } from "./response.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/forms", formRouter);
apiRouter.use("/public/forms", publicFormRouter);
apiRouter.use("/public/forms", responseRouter);

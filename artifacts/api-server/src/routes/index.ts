import { Router, type IRouter } from "express";
import healthRouter from "./health";
import analizarRouter from "./analizar";

const router: IRouter = Router();

router.use(healthRouter);
router.use(analizarRouter);

export default router;

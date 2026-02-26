import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import { addTask } from "../controllers/task.controller.js";

const router = Router();

router.post("/", authenticate, addTask);

export default router;

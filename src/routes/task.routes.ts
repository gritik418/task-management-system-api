import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import { addTask, getTasks } from "../controllers/task.controller.js";

const router = Router();

router.post("/", authenticate, addTask);

router.get("/", authenticate, getTasks);

export default router;

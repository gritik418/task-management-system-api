import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import {
  addTask,
  getTaskDetails,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";

const router = Router();

router.post("/", authenticate, addTask);

router.get("/", authenticate, getTasks);

router.get("/:taskId", authenticate, getTaskDetails);

router.patch("/:taskId", authenticate, updateTask);

export default router;

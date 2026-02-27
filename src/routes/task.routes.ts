import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import {
  addTask,
  deleteTask,
  getTaskDetails,
  getTasks,
  toggleTaskStatus,
  updateTask,
} from "../controllers/task.controller.js";

const router = Router();

router.post("/", authenticate, addTask);

router.get("/", authenticate, getTasks);

router.get("/:taskId", authenticate, getTaskDetails);

router.patch("/:taskId", authenticate, updateTask);

router.delete("/:taskId", authenticate, deleteTask);

router.patch("/:taskId/toggle", authenticate, toggleTaskStatus);

export default router;

import type { Request, Response } from "express";
import {
  createTaskSchema,
  getTasksQuerySchema,
} from "../validations/task.validation.js";
import z from "zod";
import prisma from "../lib/prisma.js";

export const addTask = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = createTaskSchema.safeParse(data);
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!result.success) {
      const tree = z.flattenError(result.error);

      const errors: Record<string, string> = {};

      for (const [key, value] of Object.entries(tree.fieldErrors)) {
        if (errors[key]) continue;
        errors[key] = value.at(0) as string;
      }
      return res.status(400).json({
        success: false,
        message: "Validation Error.",
        errors,
      });
    }

    const { title, description } = result.data;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        userId,
        status: "TODO",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Task added successfully.",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const data = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const result = getTasksQuerySchema.safeParse(data);

    if (!result.success) {
      const tree = z.flattenError(result.error);

      const errors: Record<string, string> = {};

      for (const [key, value] of Object.entries(tree.fieldErrors)) {
        if (errors[key]) continue;
        errors[key] = value.at(0) as string;
      }
      return res.status(400).json({
        success: false,
        message: "Validation Error.",
        errors,
      });
    }

    const { limit, page, search, status } = result.data;

    let where: Record<string, string | object> = {
      userId,
    };

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (status) {
      where.status = status;
    }

    const skip = Number(page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
      }),
      prisma.task.count({
        where,
      }),
    ]);

    const pagination = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully.",
      tasks,
      pagination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

import type { Request, Response } from "express";
import { registerSchema } from "../validations/auth.validation.js";
import z from "zod";
import prisma from "../lib/prisma.js";
import { hashValue } from "../utils/hash.js";

export const register = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const result = registerSchema.safeParse(data);

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

    const { name, email, password } = result.data;

    const existingEmail = await prisma.user.findUnique({ where: { email } });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hashedPassword = await hashValue(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully. Please login.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error,
    });
  }
};

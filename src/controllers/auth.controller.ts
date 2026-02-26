import type { Request, Response } from "express";
import z from "zod";
import { cookieOptions } from "../constants/cookie.js";
import prisma from "../lib/prisma.js";
import { compareValue, hashValue } from "../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  type TokenPayload,
} from "../utils/token.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";

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
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const result = loginSchema.safeParse(data);

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

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isPasswordValid = await compareValue(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const existingRefreshToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!existingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token.",
      });
    }

    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token.",
      });
    }

    await prisma.refreshToken.delete({
      where: { token: existingRefreshToken.token },
    });

    const newRefreshToken = generateRefreshToken({
      id: payload.id,
      email: payload.email,
    });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: payload.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = generateAccessToken({
      id: payload.id,
      email: payload.email,
    });

    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      accessToken,
    });
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

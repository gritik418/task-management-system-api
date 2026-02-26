import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/token";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
      };
    }
  }
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({
        success: false,
        message: "Please login.",
      });

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const verify = verifyAccessToken(token);
    if (!verify)
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });

    req.user = {
      id: verify.id,
      email: verify.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }
};

export default authenticate;

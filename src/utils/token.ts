import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET: string =
  process.env.JWT_SECRET || "default_access_secret";

const JWT_REFRESH_SECRET: string =
  process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

export interface TokenPayload {
  id: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });
};

export const generateRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

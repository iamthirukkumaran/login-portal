// lib/auth/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = "7d"; // token valid for 7 days


// GENERATE ACCESS TOKEN

export function generateAccessToken(payload: object) {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
  } catch (err) {
    console.error("❌ Error generating token:", err);
    return null;
  }
}


// VERIFY TOKEN (Used in middleware)

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("❌ Invalid or expired token");
    return null;
  }
}


// DECODE TOKEN (without verifying)

export function decodeToken(token: string) {
  try {
    return jwt.decode(token);
  } catch (err) {
    console.error("❌ Error decoding token:", err);
    return null;
  }
}

import { NextFunction, Request, Response } from "express";
import { Token } from "../models/types";
const knex = require("../database/db");

// export function verifyToken(req: Request, res: Response, next: NextFunction) {
//   const token = req.headers["authorization"];
//   if (!token) {
//     res.status(401).json({ error: "Unauthorized" });
//     return;
//   }
//   // Perform token validation logic here (e.g., check if the token is valid in your database)
//   // For simplicity, assume the token is valid in this example
//   next();
// }

// Middleware to verify token
export async function verifyToken(req: any, res: any, next: NextFunction) {
  const token: string | undefined = req.headers["authorization"];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const tokenInfo: Token | undefined = await knex("tokens")
      .where({ token })
      .first();
    if (!tokenInfo) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    req.userId = tokenInfo.user_id;
    next();
  } catch (error) {
    console.error("Error verifying token: ", error);
    res.status(500).json({ error: "Error verifying token" });
  }
}

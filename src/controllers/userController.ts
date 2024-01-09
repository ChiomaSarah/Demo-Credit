// import { Request, Response } from "express";
// const router = require("../routes/auth");
// const knex = require("../database/db");
// const { generateToken } = require("../middleware/generateToken");
// const crypto = require("crypto");
// const bcrypt = require("bcryptjs");
// import type { User, Token } from "../models/types";
// // const knex = require("../../knexfile"); // Import the Knex configuration
// // const app = express();

// // const router = express.Router();

// export const createUser = async (req: Request, res: Response) => {
//   // Implement logic for creating a new user
//   router.post("/register", async (req: any, res: any) => {
//     const { username, password } = req.body;
//     // Perform validation and hashing of the password
//     const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

//     try {
//       const newUser: User = {
//         username,
//         password: hashedPassword,

//         email: "",
//       };
//       const insertedUserIds = await knex("users").insert(newUser);
//       res.status(200).json({
//         message: "User registered successfully",
//         userId: insertedUserIds[0],
//       });
//     } catch (error) {
//       console.error("Error registering user: ", error);
//       res.status(500).json({ error: "Error registering user" });
//     }
//   });
// };

// export const userLogin = async (req: Request, res: Response) => {
//   // Implement logic to retrieve a user by email

//   router.post("/login", async (req: any, res: any) => {
//     const { username, password } = req.body;

//     try {
//       const user: User | undefined = await knex("users")
//         .where({ username })
//         .first();
//       if (!user) {
//         res.status(401).json({ error: "Invalid credentials" });
//         return;
//       }

//       const passwordMatch = await bcrypt.compare(password, user.password);
//       if (!passwordMatch) {
//         res.status(401).json({ error: "Invalid credentials" });
//         return;
//       }

//       const token: string = crypto.randomBytes(64).toString("hex");
//       const newToken: Token = {
//         id: 0, // Ensure your database handles the ID assignment
//         user_id: user.id,
//         token,
//         // Other fields
//       };

//       await knex("tokens").insert(newToken);
//       res.status(200).json({ token });
//     } catch (error) {
//       console.error("Error logging in: ", error);
//       res.status(500).json({ error: "Error logging in" });
//     }
//   });
// };
// export const getUserById = async (req: Request, res: Response) => {
//   // Implement logic to retrieve a user by ID
// };

// // Other user-related operations...

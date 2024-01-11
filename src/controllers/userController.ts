import { Request, Response } from "express";
const knex = require("../database/db");
import crypto from "crypto";
import bcrypt from "bcryptjs";
import type { User, Token } from "../models/types";

export const createUser = async (req: Request, res: Response) => {
  const { firstname, lastname, phoneNumber, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser: User = {
      firstname,
      lastname,
      phoneNumber,
      password: hashedPassword,
      email,
    };
    const insertedUserIds = await knex("users").insert(newUser);
    res.status(200).json({
      message: "User registered successfully",
      userId: insertedUserIds[0],
    });
  } catch (error) {
    console.error("Error registering user: ", error);
    res.status(500).json({ error: "Error registering user" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user: User | undefined = await knex("users").where({ email }).first();
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token: string = crypto.randomBytes(64).toString("hex");
    const newToken: Token = {
      id: 0,
      user_id: user.id,
      token,
    };

    await knex("tokens").insert(newToken);
    res.status(200).json({ message: "Login Accepted!", token });
  } catch (error) {
    console.error("Error logging in: ", error);
    res.status(500).json({ error: "Error logging in" });
  }
};

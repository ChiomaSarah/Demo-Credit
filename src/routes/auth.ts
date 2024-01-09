// "use strict";
const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const knex = require("../database/db"); // Import the Knex configuration
import type { User, Token } from "../models/types";

const router = express.Router();

// User Registration
router.post("/register", async (req: any, res: any) => {
  const { firstname, lastname, phoneNumber, email, password } = req.body;
  // Perform validation and hashing of the password
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

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
});

// User Login
router.post("/login", async (req: any, res: any) => {
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
      id: 0, // Ensure your database handles the ID assignment
      user_id: user.id,
      token,
      // Other fields
    };

    await knex("tokens").insert(newToken);
    res.status(200).json({ message: "Login Accepted!", token });
  } catch (error) {
    console.error("Error logging in: ", error);
    res.status(500).json({ error: "Error logging in" });
  }
});

module.exports = router;

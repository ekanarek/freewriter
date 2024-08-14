import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import pkg from "pg";
const { Client } = pkg;

const router = express.Router();
const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect();

// User Registration Route
router.post(
  "/register",
  [
    // Validation
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user already exists
      const userResult = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (userResult.rows.length > 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert the new user into the database
      const result = await client.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
        [email, hashedPassword]
      );

      const userId = result.rows[0].id;

      // Generate JWT Token
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({ token });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

export default router;

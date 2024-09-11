import express from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import client from "./db.js";

const router = express.Router();

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
      console.error("Validation errors:", errors.array());
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
        console.error("User already exists with email:", email);
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
      console.log("User created with ID:", userId);

      // Generate JWT Token
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).json({ token });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// User Sign-In Route
router.post(
  "/login",
  [
    // Validation
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const userResult = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (userResult.rows.length === 0) {
        console.error("User not found with email:", email);
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const user = userResult.rows[0];

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.error("Invalid password for email:", email);
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ token });
    } catch (err) {
      console.error("Error during sign-in:", err);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// JWT Verification Middleware
export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Extracts token from 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifies the token
    req.userId = decoded.userId; // Attaches userId to the request object
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

export default router;

import express from "express";
import client from "./db.js";
import { verifyToken } from "./auth.js";

const router = express.Router();

// Route to Save a New Journal Entry
router.post("/entries", verifyToken, async (req, res) => {
    const { content } = req.body;
    const userId = req.userId;

    try {
        const result = await client.query(
            "INSERT INTO journal_entries (user_id, content) VALUES ($1, $2) RETURNING id",
            [userId, content]
        );

        res.status(201).json({ entryId: result.rows[0].id });
    } catch (error) {
        console.error("Error saving entry:", error);
        res.status(500).json({ error: "Failed to save entry" });
    }
})

export default router;
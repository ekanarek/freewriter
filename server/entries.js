import express from "express";
import client from "./db.js";
import { verifyToken } from "./auth.js";

const router = express.Router();

// Route to Save a New Journal Entry
router.post("/entries", verifyToken, async (req, res) => {
    const { photoId, content } = req.body;
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    if (!photoId) {
        return res.status(400).json({ error: "Photo ID is required" });
    }

    try {
        const result = await client.query(
            "INSERT INTO journal_entries (user_id, photo_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id",
            [userId, photoId, content]
        );

        console.log("Insertion result:", result);

        res.status(201).json({ entryId: result.rows[0].id });
    } catch (error) {
        console.error("Error saving entry:", error);
        res.status(500).json({ error: "Failed to save entry" });
    }
})

// Route to Fetch Journal Entries for the Logged-In User
router.get("/entries", verifyToken, async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required"});
    }

    try {
        const result = await client.query("SELECT id, photo_id, content, created_at FROM journal_entries WHERE user_id = $1 ORDER BY created_at DESC", [userId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching journal entries: ", error);
        res.status(500).json({ error: "Failed to fetch entries "});
    }
})

export default router;
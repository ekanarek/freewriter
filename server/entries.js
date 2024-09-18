import express from "express";
import client from "./db.js";
import { verifyToken } from "./auth.js";
import jwt from "jsonwebtoken";
import { fetchPhotoById } from "./unsplashService.js";
import dotenv from "dotenv";

dotenv.config();

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


//Fetch a single journal entry by its ID, including the associated photo
router.get("/entries/:entryId?", async (req, res) => {
    const entryId = req.params.entryId;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {        
        const entry = await client.query(
            "SELECT * FROM journal_entries WHERE id = $1 AND user_id = $2", [entryId, decoded.userId]
        );

        const journalEntry = entry.rows[0];
        if (!journalEntry) {
            return res.status(404).json({ error: "Journal entry not found" });
        }

        const photo = await client.query(
            "SELECT * FROM photos WHERE id = $1", [journalEntry.photo_id]
        );

        const unsplashPhoto = await fetchPhotoById(photo.rows[0].unsplash_id);

        res.json({
            ...journalEntry, 
            photo: unsplashPhoto,
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching entry." });
    }
})

// Route to Update an Existing Journal Entry
router.put("/entries/:entryId", verifyToken, async (req, res) => {
    const entryId = req.params.entryId;
    const { content } = req.body;
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const result = await client.query("UPDATE journal_entries SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *", [content, entryId, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Journal entry not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating entry: ", error);
        res.status(500).json({ error: "Failed to update entry" });
    }
});

// Route to Delete a Journal Entry
router.delete("/entries/:entryId", verifyToken, async (req, res) => {
    const entryId = req.params.entryId;
    const userId = req.userId;

    try {
        const result = await client.query("DELETE FROM journal_entries WHERE id = $1 AND user_id = $2 RETURNING *", [entryId, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Journal entry not found" });
        }

        res.status(200).json({ message: "Journal entry deleted successfully "});
    } catch (error) {
        console.error("Error deleting entry: ", error);
        res.status(500).json({ error: "Failed to delete entry" });
    }

})

export default router;
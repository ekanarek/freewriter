import express from "express";
import client from "./db.js";
import { verifyToken } from "./auth.js";

const router = express.Router();

// Route to Add Photo to the Database
router.post("/photos", verifyToken, async (req, res) => {
    const { unsplash_id, photographer } = req.body;
    console.log(req.body);

    if (!unsplash_id || !photographer) {
        return res.status(400).json({ error: "Unsplash ID and Photographer are required "});
    }

    try {
        // Checking if photo already exists in database
        const existingPhoto = await client.query("SELECT id FROM photos WHERE unsplash_id = $1", [unsplash_id]);

        if (existingPhoto.rows.length > 0) {
            console.log("Photo already exists, returning existing ID:", existingPhoto.rows[0].id);
            return res.status(200).json({ photoId: existingPhoto.rows[0].id });
        }

        // Insert into photos table
        const result = await client.query(
            "INSERT INTO photos (unsplash_id, photographer) VALUES ($1, $2) RETURNING id", [unsplash_id, photographer]
        );

        const photoId = result.rows[0].id;
        res.status(201).json({ photoId });
    } catch (error) {
        console.error("Error saving photo:", {
            message: error.message,
            stack: error.stack,
            query: "INSERT INTO photos (unsplash_id, photographer) VALUES ($1, $2) RETURNING id",
            params: [unsplash_id, photographer]
        });
        res.status(500).json({ error: "Failed to save photo" });
    }
});

export default router;
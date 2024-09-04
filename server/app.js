import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import ViteExpress from "vite-express";
import { getRandomPhoto } from "./unsplashService.js";
import authRoutes from "./auth.js";
import entryRoutes from "./entries.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", entryRoutes);

ViteExpress.config({ printViteDevServerHost: true });

app.get("/api/photo", async (req, res) => {
  try {
    const photo = await getRandomPhoto();
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch photo" });
  }
});

ViteExpress.listen(app, port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);

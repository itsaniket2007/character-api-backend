import dotenv from "dotenv";
dotenv.config(); // load variables from .env

import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const app = express();

// Middleware
app.use(express.json());   // parse JSON request bodies
app.use(cookieParser());   // read cookies (our login token)

// Routes
app.get("/", (req, res) => res.send("Character API is running"));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;

// Connect to the database first, then start listening
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});

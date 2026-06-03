import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import dbRoutes from "./routes/dbRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// --- global middleware ---
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- static files (Part 1 mockups / built React SPA live here) ---
app.use(express.static(path.join(__dirname, "public")));

// --- REST API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/db", dbRoutes);

// --- OpenAPI spec + Swagger UI ---
app.get("/api/swagger.json", (req, res) => res.json(swaggerSpec));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: "MovieReel API Docs" }));

// --- /db helper page (wipe + seed) ---
app.get("/db", (req, res) => res.sendFile(path.join(__dirname, "public", "db.html")));

// --- root: serves the homepage (static now, React build later) ---
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

// --- 404 + central error handler ---
app.use(notFound);
app.use(errorHandler);

export default app;

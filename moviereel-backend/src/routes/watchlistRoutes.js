import express from "express";
import { body } from "express-validator";
import { myWatchlist, addToWatchlist, removeFromWatchlist } from "../controllers/watchlistController.js";
import { runValidation } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Watchlist
 *     description: Per-user watchlist
 */

/**
 * @openapi
 * /api/watchlist:
 *   get:
 *     tags: [Watchlist]
 *     summary: Get the current user's watchlist
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Array of watchlist entries }
 *   post:
 *     tags: [Watchlist]
 *     summary: Add a movie to the watchlist
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movie]
 *             properties:
 *               movie: { type: string, description: Movie id }
 *     responses:
 *       201: { description: Added }
 */
router.get("/", protect, myWatchlist);
router.post("/", protect, body("movie").isMongoId().withMessage("Valid movie id required."), runValidation, addToWatchlist);

/**
 * @openapi
 * /api/watchlist/{movieId}:
 *   delete:
 *     tags: [Watchlist]
 *     summary: Remove a movie from the watchlist
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Removed }
 */
router.delete("/:movieId", protect, removeFromWatchlist);

export default router;

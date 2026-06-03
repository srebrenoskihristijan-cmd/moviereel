import express from "express";
import { body } from "express-validator";
import { listGenres, createGenre } from "../controllers/genreController.js";
import { runValidation } from "../middleware/validate.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Genres
 *     description: Movie genres
 */

/**
 * @openapi
 * /api/genres:
 *   get:
 *     tags: [Genres]
 *     summary: List all genres
 *     responses:
 *       200: { description: Array of genres }
 *   post:
 *     tags: [Genres]
 *     summary: Create a genre (admin only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:        { type: string }
 *               description:  { type: string }
 *     responses:
 *       201: { description: Created }
 *       403: { description: Admin only }
 */
router.get("/", listGenres);
router.post("/", protect, admin, body("name").trim().notEmpty().withMessage("Name required."), runValidation, createGenre);

export default router;

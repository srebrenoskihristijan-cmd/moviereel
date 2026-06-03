import express from "express";
import { body } from "express-validator";
import {
  listMovies, getMovie, createMovie, updateMovie, deleteMovie, searchExternal,
} from "../controllers/movieController.js";
import { runValidation } from "../middleware/validate.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

const movieValidators = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("year").isInt({ min: 1888, max: 2100 }).withMessage("Year must be 1888-2100."),
  body("genre").isMongoId().withMessage("A valid genre id is required."),
  body("director").trim().notEmpty().withMessage("Director is required."),
  body("runtime").optional().isInt({ min: 1, max: 600 }).withMessage("Runtime 1-600 min."),
  body("accent").optional().matches(/^#[0-9a-fA-F]{6}$/).withMessage("Accent must be a hex colour."),
];

/**
 * @openapi
 * tags:
 *   - name: Movies
 *     description: Browse, search and manage movies
 */

/**
 * @openapi
 * /api/movies:
 *   get:
 *     tags: [Movies]
 *     summary: List or search movies
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search term (title or director)
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *         description: Filter by genre id
 *     responses:
 *       200: { description: Array of movies }
 */
router.get("/", listMovies);

/**
 * @openapi
 * /api/movies/external:
 *   get:
 *     tags: [Movies]
 *     summary: Search the external source (TMDB)
 *     description: Returns external movie data (posters, ratings) not stored locally.
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: TMDB results }
 *       503: { description: TMDB API key not configured }
 */
router.get("/external", searchExternal);

/**
 * @openapi
 * /api/movies/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Get a single movie
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: A movie }
 *       404: { description: Not found }
 */
router.get("/:id", getMovie);

/**
 * @openapi
 * /api/movies:
 *   post:
 *     tags: [Movies]
 *     summary: Create a movie (admin only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, year, genre, director]
 *             properties:
 *               title:    { type: string }
 *               year:     { type: integer, example: 2024 }
 *               genre:    { type: string, description: Genre id }
 *               director: { type: string }
 *               runtime:  { type: integer, example: 120 }
 *               overview: { type: string }
 *               accent:   { type: string, example: "#e0a93f" }
 *     responses:
 *       201: { description: Created }
 *       403: { description: Admin only }
 */
router.post("/", protect, admin, movieValidators, runValidation, createMovie);

/**
 * @openapi
 * /api/movies/{id}:
 *   put:
 *     tags: [Movies]
 *     summary: Update a movie (admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Updated }
 *       403: { description: Admin only }
 *       404: { description: Not found }
 *   delete:
 *     tags: [Movies]
 *     summary: Delete a movie (admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Deleted }
 *       403: { description: Admin only }
 *       404: { description: Not found }
 */
router.put("/:id", protect, admin, movieValidators, runValidation, updateMovie);
router.delete("/:id", protect, admin, deleteMovie);

export default router;

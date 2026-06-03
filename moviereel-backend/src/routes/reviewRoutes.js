import express from "express";
import { body } from "express-validator";
import { listReviews, createReview, deleteReview } from "../controllers/reviewController.js";
import { runValidation } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Reviews
 *     description: User reviews and ratings
 */

/**
 * @openapi
 * /api/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: List reviews (optionally filtered by movie)
 *     parameters:
 *       - in: query
 *         name: movie
 *         schema: { type: string }
 *         description: Movie id
 *     responses:
 *       200: { description: Array of reviews }
 *   post:
 *     tags: [Reviews]
 *     summary: Create or update your review for a movie
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movie, rating, text]
 *             properties:
 *               movie:  { type: string, description: Movie id }
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               text:   { type: string }
 *     responses:
 *       201: { description: Saved }
 *       401: { description: Not authenticated }
 */
router.get("/", listReviews);
router.post(
  "/",
  protect,
  body("movie").isMongoId().withMessage("Valid movie id required."),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5."),
  body("text").trim().isLength({ min: 3, max: 1000 }).withMessage("Text must be 3-1000 chars."),
  runValidation,
  createReview
);

/**
 * @openapi
 * /api/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review (owner or admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Deleted }
 *       403: { description: Not allowed }
 *       404: { description: Not found }
 */
router.delete("/:id", protect, deleteReview);

export default router;

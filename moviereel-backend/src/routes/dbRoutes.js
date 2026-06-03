import express from "express";
import { reset, seed } from "../controllers/dbController.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Database
 *     description: Testing helpers — wipe and seed the database
 */

/**
 * @openapi
 * /api/db/reset:
 *   post:
 *     tags: [Database]
 *     summary: Delete ALL data from the database
 *     responses:
 *       200: { description: All data deleted }
 */
router.post("/reset", reset);

/**
 * @openapi
 * /api/db/seed:
 *   post:
 *     tags: [Database]
 *     summary: Insert the initial demo data
 *     responses:
 *       200: { description: Initial data inserted }
 */
router.post("/seed", seed);

export default router;

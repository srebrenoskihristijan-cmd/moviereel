import express from "express";
import { body } from "express-validator";
import { register, login, me } from "../controllers/authController.js";
import { runValidation } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Registration, login and current user
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string, example: filmfan }
 *               email:    { type: string, example: fan@mail.com }
 *               password: { type: string, example: secret123 }
 *     responses:
 *       201: { description: Created — returns JWT token and user }
 *       400: { description: Validation failed }
 *       409: { description: Username or email already in use }
 */
router.post(
  "/register",
  body("username").matches(/^[a-zA-Z0-9_]{3,20}$/).withMessage("3-20 letters, numbers or underscores."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  runValidation,
  register
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in and receive a JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, example: admin }
 *               password: { type: string, example: admin123 }
 *     responses:
 *       200: { description: OK — returns JWT token and user }
 *       401: { description: Invalid credentials }
 */
router.post(
  "/login",
  body("username").notEmpty().withMessage("Username is required."),
  body("password").notEmpty().withMessage("Password is required."),
  runValidation,
  login
);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the currently authenticated user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Current user }
 *       401: { description: Not authenticated }
 */
router.get("/me", protect, me);

export default router;

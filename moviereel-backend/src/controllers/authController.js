import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendWelcomeEmail } from "../services/mailer.js";

// Generates the JWT token
const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Formats the user object for public responses
const publicUser = (u) => ({ 
  id: u._id, 
  username: u.username, 
  email: u.email, 
  role: u.role 
});

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) {
      return res.status(409).json({ message: "Username or email already in use." });
    }

    // Create new user
    const user = await User.create({ username, email, password });
    
    // Send email asynchronously without blocking the response
    sendWelcomeEmail(email, username).catch((e) => console.warn("Email skipped:", e.message));

    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) { 
    next(err); 
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // FIX: Look for a match in either the username OR the email fields
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }]
    }).select("+password");

    // FIX: Verify user exists AND the password matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) { 
    next(err); 
  }
};

export const me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};
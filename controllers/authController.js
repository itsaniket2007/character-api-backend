import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Create a token and store it in an httpOnly cookie
const sendToken = (res, user, status, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });

  res.status(status).json({
    message,
    token, // also returned so you can use it as a Bearer token in Postman
    user: { id: user._id, username: user.username, email: user.email },
  });
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (exists) return res.status(409).json({ message: "User already exists" });

    // Hash the password before saving (never store plain text)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashedPassword });
    sendToken(res, user, 201, "Registered successfully");
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare the typed password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    sendToken(res, user, 200, "Logged in successfully");
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

// GET /api/auth/me  (protected)
export const getMe = (req, res) => {
  res.status(200).json(req.user);
};

import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protects routes: only logged-in users can pass
const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Also allow "Authorization: Bearer <token>" (handy for Postman)
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User no longer exists" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;

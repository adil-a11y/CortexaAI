import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

router.get("/register", (req, res) => {
  res.status(405).json({ error: "Method not allowed. Use POST to register." });
});

router.get("/login", (req, res) => {
  res.status(405).json({ error: "Method not allowed. Use POST to login." });
});

// In-Memory Storage for MOCK mode (if DB is disconnected)
export const mockUsers = [];

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if DB is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ MOCK MODE: Storing user in memory (DB disconnected)");
      const existing = mockUsers.find(u => u.email === email);
      if (existing) return res.status(400).json({ error: "User exists (Mock)" });

      const hashed = await bcrypt.hash(password, 10);
      const user = { _id: Date.now().toString(), email, password: hashed, plan: "free" };
      mockUsers.push(user);

      // ✅ CREATE TOKEN FOR MOCK
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

      return res.json({
        token,
        user: { email: user.email, plan: user.plan }
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    // ✅ CREATE TOKEN
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        email: user.email,
        plan: user.plan
      }
    });

  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if DB is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ MOCK MODE: Checking memory (DB disconnected)");
      const user = mockUsers.find(u => u.email === email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials (Mock)" });
      }
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token, user: { email: user.email, plan: user.plan } });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        email: user.email,
        plan: user.plan
      }
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

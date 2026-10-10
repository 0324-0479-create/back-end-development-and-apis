import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findByUsername } from "../utils/db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  // Missing fields: 400
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  // Unknown username: 401
  const user = findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  // Wrong password: 401
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  // Valid credentials: 200 with a token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.status(200).json({ token });
});

export default router;
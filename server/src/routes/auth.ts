/// <reference path="../express.d.ts" />
import { Router } from "express";
import { createUser, logInUser, logOutUser } from "../controllers/auth";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/sign-up", createUser);
router.post("/sign-in", logInUser);
router.post("/log-out", logOutUser);
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;

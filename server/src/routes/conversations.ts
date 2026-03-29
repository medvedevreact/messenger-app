import { Router } from "express";
import {
  createConversation,
  getConversations,
  getMessages,
  uploadImage,
} from "../controllers/conversations";
import { authenticateToken } from "../middleware/auth";
import upload from "../middleware/upload";

const router = Router();

router.post("/conversations", authenticateToken, createConversation);
router.get("/conversations", authenticateToken, getConversations);
router.get("/conversations/:id/messages", authenticateToken, getMessages);
router.post(
  "/conversations/:conversationId/upload",
  authenticateToken,
  upload.single("image"),
  uploadImage,
);

export default router;

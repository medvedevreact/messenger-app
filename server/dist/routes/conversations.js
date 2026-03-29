"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversations_1 = require("../controllers/conversations");
const auth_1 = require("../middleware/auth");
const upload_1 = __importDefault(require("../middleware/upload"));
const router = (0, express_1.Router)();
router.post("/conversations", auth_1.authenticateToken, conversations_1.createConversation);
router.get("/conversations", auth_1.authenticateToken, conversations_1.getConversations);
router.get("/conversations/:id/messages", auth_1.authenticateToken, conversations_1.getMessages);
router.post("/conversations/:conversationId/upload", auth_1.authenticateToken, upload_1.default.single("image"), conversations_1.uploadImage);
exports.default = router;

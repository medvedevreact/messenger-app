"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.getMessages = exports.createConversation = exports.getConversations = void 0;
const conversation_1 = __importDefault(require("../models/conversation"));
const user_1 = __importDefault(require("../models/user"));
const message_1 = __importDefault(require("../models/message"));
const getConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const conversations = yield conversation_1.default.find({
            participants: userId,
        })
            .populate("participants", "email")
            .sort("-updatedAt");
        res.json(conversations);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getConversations = getConversations;
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { participantId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const participant = yield user_1.default.findById(participantId);
        if (!participant) {
            return res.status(404).json({ error: "User not found" });
        }
        let conversation = yield conversation_1.default.findOne({
            participants: { $all: [userId, participantId], $size: 2 },
        }).populate("participants", "email");
        if (conversation) {
            return res.json(conversation);
        }
        conversation = yield conversation_1.default.create({
            participants: [userId, participantId],
        });
        yield conversation.populate("participants", "email");
        res.status(201).json(conversation);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createConversation = createConversation;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield message_1.default.find({ conversationId: req.params.id })
            .sort({ createdAt: 1 })
            .populate("senderId", "email");
        console.log("MESSAGES: ", messages);
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getMessages = getMessages;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Файл не найден" });
        }
        res.json({ url: req.file.path });
    }
    catch (error) {
        console.error("[Upload] Ошибка:", error);
        res.status(500).json({ error: "Ошибка при загрузке изображения" });
    }
});
exports.uploadImage = uploadImage;

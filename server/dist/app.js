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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const conversations_1 = __importDefault(require("./routes/conversations"));
const message_1 = __importDefault(require("./models/message"));
console.log("[App] Starting...");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
dotenv_1.default.config();
const { MONGO_URL } = process.env;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173",
}));
app.use(auth_1.default);
app.use("/users", users_1.default);
app.use(conversations_1.default);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});
io.on("connection", (socket) => {
    console.log("[Socket] User connected:", socket.id);
    socket.on("join-chat", (chatId) => {
        socket.join(chatId);
        console.log(`[Socket] ${socket.id} joined chat: ${chatId}`);
    });
    socket.on("send-message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ chatId, message }) {
        const saved = yield message_1.default.create(Object.assign({ conversationId: chatId, senderId: message.senderId, text: message.text }, (message.imageUrl && { imageUrl: message.imageUrl })));
        yield saved.populate("senderId", "email");
        console.log(`[Socket] Message sent to ${chatId}:`, saved);
        io.to(chatId).emit("new-message", saved);
    }));
    socket.on("disconnect", () => {
        console.log("[Socket] User disconnected:", socket.id);
    });
});
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGO_URL);
        console.log("[App] MongoDB connected");
        httpServer.listen(3000, () => {
            console.log("[App] Server running on http://localhost:3000");
        });
    }
    catch (error) {
        console.error(error);
    }
});
run();

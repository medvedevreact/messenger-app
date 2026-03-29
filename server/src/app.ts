import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import conversationsRouter from "./routes/conversations";
import Message from "./models/message";

console.log("[App] Starting...");

const app = express();
const httpServer = createServer(app);

dotenv.config();
const { MONGO_URL } = process.env;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  }),
);

app.use(authRouter);
app.use("/users", usersRouter);
app.use(conversationsRouter);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("[Socket] User connected:", socket.id);

  socket.on("join-chat", (chatId: string) => {
    socket.join(chatId);
    console.log(`[Socket] ${socket.id} joined chat: ${chatId}`);
  });

  socket.on("send-message", async ({ chatId, message }) => {
    const saved = await Message.create({
      conversationId: chatId,
      senderId: message.senderId,
      text: message.text,
      ...(message.imageUrl && { imageUrl: message.imageUrl }),
    });
    await saved.populate("senderId", "email");
    console.log(`[Socket] Message sent to ${chatId}:`, saved);
    io.to(chatId).emit("new-message", saved);
  });

  socket.on("disconnect", () => {
    console.log("[Socket] User disconnected:", socket.id);
  });
});

const run = async () => {
  try {
    await mongoose.connect(MONGO_URL as string);
    console.log("[App] MongoDB connected");

    httpServer.listen(3000, () => {
      console.log("[App] Server running on http://localhost:3000");
    });
  } catch (error) {
    console.error(error);
  }
};

run();

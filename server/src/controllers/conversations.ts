/// <reference path="../express.d.ts" />
import { Request, Response } from "express";
import Conversation from "../models/conversation";
import User from "../models/user";
import Message from "../models/message";

export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "email")
      .sort("-updatedAt");

    res.json(conversations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createConversation = async (req: Request, res: Response) => {
  try {
    const { participantId } = req.body;
    const userId = req.user?._id;

    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ error: "User not found" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId], $size: 2 },
    }).populate("participants", "email");

    if (conversation) {
      return res.json(conversation);
    }

    conversation = await Conversation.create({
      participants: [userId, participantId],
    });

    await conversation.populate("participants", "email");

    res.status(201).json(conversation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id })
      .sort({ createdAt: 1 })
      .populate("senderId", "email");

    console.log("MESSAGES: ", messages);

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Файл не найден" });
    }

    res.json({ url: (req.file as any).path });
  } catch (error) {
    console.error("[Upload] Ошибка:", error);
    res.status(500).json({ error: "Ошибка при загрузке изображения" });
  }
};

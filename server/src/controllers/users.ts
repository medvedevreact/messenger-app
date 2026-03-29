/// <reference path="../express.d.ts" />
import { Request, Response } from "express";
import User from "../models/user";

const SEARCH_LIMIT = 20;

export const searchUsers = async (req: Request, res: Response) => {
  const query = (req.query.q as string)?.trim() || "";
  const currentUserId = req.user?._id;

  if (!query || query.length < 2) {
    return res.status(400).json({
      error: "Минимум 2 символа для поиска",
    });
  }

  try {
    const searchRegex = new RegExp(query, "i");

    const users = await User.find({
      _id: { $ne: currentUserId },
      email: searchRegex,
    })
      .select("email createdAt")
      .limit(SEARCH_LIMIT)
      .lean();

    return res.json({ users });
  } catch (error) {
    console.error("Search users error:", error);
    return res.status(500).json({ error: "Ошибка поиска" });
  }
};

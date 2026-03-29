import { NextFunction, Request, Response } from "express";
import User from "../models/user";

export const createUser = async (req: Request, res: Response) => {
  const user = req.body;
  try {
    const newUser = await User.create(user);
    const token = newUser.generateToken();
    console.log({ token });

    res
      .status(201)
      .cookie("accessToken", token, {
        httpOnly: true,
        maxAge: 3600000,
        path: "/",
      })
      .json({ user: newUser, message: "ok" });
  } catch (error: any) {
    console.error("Create user error:", error);
    const message =
      error?.message || error?.errors
        ? JSON.stringify(error.errors || error.message)
        : "Failed to create user";
    res.status(500).json({ error: "Failed to create user", details: message });
  }
};

export const logOutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken", { path: "/", httpOnly: true });
    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to logout" });
  }
};

export const logInUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = user.generateToken();

    res
      .status(200)
      .cookie("accessToken", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      })
      .json({ user, message: "ok" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Failed to logIn" });
  }
};

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
exports.logInUser = exports.logOutUser = exports.createUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    try {
        const newUser = yield user_1.default.create(user);
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
    }
    catch (error) {
        console.error("Create user error:", error);
        const message = (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : error.errors)
            ? JSON.stringify(error.errors || error.message)
            : "Failed to create user";
        res.status(500).json({ error: "Failed to create user", details: message });
    }
});
exports.createUser = createUser;
const logOutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("accessToken", { path: "/", httpOnly: true });
        res.json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to logout" });
    }
});
exports.logOutUser = logOutUser;
const logInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_1.default.findByCredentials(email, password);
        const token = user.generateToken();
        res
            .status(200)
            .cookie("accessToken", token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
        })
            .json({ user, message: "ok" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to logIn" });
    }
});
exports.logInUser = logInUser;

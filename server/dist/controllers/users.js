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
exports.searchUsers = void 0;
const user_1 = __importDefault(require("../models/user"));
const SEARCH_LIMIT = 20;
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const query = ((_a = req.query.q) === null || _a === void 0 ? void 0 : _a.trim()) || "";
    const currentUserId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    if (!query || query.length < 2) {
        return res.status(400).json({
            error: "Минимум 2 символа для поиска",
        });
    }
    try {
        const searchRegex = new RegExp(query, "i");
        const users = yield user_1.default.find({
            _id: { $ne: currentUserId },
            email: searchRegex,
        })
            .select("email createdAt")
            .limit(SEARCH_LIMIT)
            .lean();
        return res.json({ users });
    }
    catch (error) {
        console.error("Search users error:", error);
        return res.status(500).json({ error: "Ошибка поиска" });
    }
});
exports.searchUsers = searchUsers;

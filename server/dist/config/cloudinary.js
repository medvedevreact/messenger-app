"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cloudName = (_a = process.env.CLOUDINARY_CLOUD_NAME) === null || _a === void 0 ? void 0 : _a.trim();
const apiKey = (_b = process.env.CLOUDINARY_API_KEY) === null || _b === void 0 ? void 0 : _b.trim();
const apiSecret = (_c = process.env.CLOUDINARY_API_SECRET) === null || _c === void 0 ? void 0 : _c.trim();
if (!cloudName || !apiKey || !apiSecret) {
    console.warn("[Cloudinary] Не заданы CLOUDINARY_* переменные — загрузка изображений будет падать.");
}
cloudinary_1.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});
exports.default = cloudinary_1.v2;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const users_1 = require("../controllers/users");
const router = (0, express_1.Router)();
router.get("/search", auth_1.authenticateToken, users_1.searchUsers);
exports.default = router;

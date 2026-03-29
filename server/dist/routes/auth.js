"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../express.d.ts" />
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/sign-up", auth_1.createUser);
router.post("/sign-in", auth_1.logInUser);
router.post("/log-out", auth_1.logOutUser);
router.get("/me", auth_2.authenticateToken, (req, res) => {
    res.json({ user: req.user });
});
exports.default = router;

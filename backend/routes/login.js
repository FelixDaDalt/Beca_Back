"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const login_controller_1 = require("../controllers/login.controller");
const router = (0, express_1.Router)();
exports.router = router;
router.post('/', login_controller_1.Login);

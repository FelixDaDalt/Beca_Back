"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificar = exports.encriptar = void 0;
const bcryptjs_1 = require("bcryptjs");
const encriptar = async (pass) => {
    const passwordhash = await (0, bcryptjs_1.hash)(pass, 10);
    return passwordhash;
};
exports.encriptar = encriptar;
const verificar = async (pass, passHash) => {
    const correcto = await (0, bcryptjs_1.compare)(pass, passHash);
    return correcto;
};
exports.verificar = verificar;

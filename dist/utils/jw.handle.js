"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = exports.generarToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || 'secret';
const generarToken = async (id, id_rol, dni, id_colegio, superAdmin) => {
    const fecha_ingreso = new Date();
    const jwt = (0, jsonwebtoken_1.sign)({
        id,
        id_rol,
        fecha_ingreso,
        dni,
        id_colegio,
        superAdmin
    }, secret, {
        expiresIn: "2h",
    });
    return jwt;
};
exports.generarToken = generarToken;
const verificarToken = async (jwt) => {
    try {
        const ok = await (0, jsonwebtoken_1.verify)(jwt, secret);
        return ok;
    }
    catch (error) {
        return null;
    }
};
exports.verificarToken = verificarToken;

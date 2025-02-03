"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const error_handle_1 = require("../utils/error.handle");
const auth_service_1 = require("../services/auth.service");
const Login = async (req, res) => {
    try {
        const { tipo } = req.query;
        const nuevoLogin = await (0, auth_service_1.login)(req.body, tipo, req.ip || '', req.headers['user-agent']);
        const data = { "data": nuevoLogin, "mensaje": "Ingreso Exitoso" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al ingresar', e);
    }
};
exports.Login = Login;

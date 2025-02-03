"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenerRegistrosAdmin = exports.ObtenerRegistros = void 0;
const error_handle_1 = require("../utils/error.handle");
const registro_service_1 = require("../services/registro.service");
const ObtenerRegistros = async (req, res) => {
    try {
        const idRol = req.user?.id_rol;
        let idColegio = req.query.idColegio;
        if (idRol > 0) {
            idColegio = req.user?.id_colegio;
        }
        const listado = await (0, registro_service_1.registrosPorColegio)(idColegio, idRol);
        const data = { "data": listado, "mensaje": "Registro obtenidos" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener los registros', e);
    }
};
exports.ObtenerRegistros = ObtenerRegistros;
const ObtenerRegistrosAdmin = async (req, res) => {
    try {
        const listado = await (0, registro_service_1.registrosAdmin)();
        const data = { "data": listado, "mensaje": "Registro obtenidos" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener los registros', e);
    }
};
exports.ObtenerRegistrosAdmin = ObtenerRegistrosAdmin;

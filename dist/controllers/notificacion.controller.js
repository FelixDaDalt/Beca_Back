"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notificaciones = void 0;
const error_handle_1 = require("../utils/error.handle");
const database_1 = __importDefault(require("../config/database"));
const notificacion_service_1 = require("../services/notificacion.service");
const Notificaciones = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idusuario = req.user?.id;
        const idrol = req.user?.id_rol;
        const idColegio = req.user?.id_colegio;
        const notificacionesEncontradas = await (0, notificacion_service_1.notificaciones)(idusuario, idrol, idColegio, transaction);
        const data = { "data": notificacionesEncontradas, "mensaje": "Listado de Notificaciones" };
        await transaction.commit();
        // 6. Enviar la respuesta
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al obtener las notificaciones', e);
    }
};
exports.Notificaciones = Notificaciones;

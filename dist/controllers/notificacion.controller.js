"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notificaciones = void 0;
const error_handle_1 = require("../utils/error.handle");
const notificacion_service_1 = require("../services/notificacion.service");
const Notificaciones = async (req, res) => {
    try {
        const idusuario = req.user?.id;
        const idrol = req.user?.id_rol;
        const idColegio = req.user?.id_colegio;
        const notificacionesEncontradas = await (0, notificacion_service_1.obtenerNotificaciones)(idusuario, idrol, idColegio);
        const data = { "data": notificacionesEncontradas, "mensaje": "Listado de Notificaciones" };
        // 6. Enviar la respuesta
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        (0, error_handle_1.handleHttp)(res, 'Error al obtener las notificaciones', e);
    }
};
exports.Notificaciones = Notificaciones;

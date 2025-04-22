"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacionesAdmin = void 0;
const error_handle_1 = require("../utils/error.handle");
const notificacionesAdmin_1 = require("../services/notificacionesAdmin");
const NotificacionesAdmin = async (req, res) => {
    try {
        const idusuario = req.user?.id;
        const notificacionesEncontradas = await (0, notificacionesAdmin_1.obtenerNotificacionesAdmin)();
        const data = { "data": notificacionesEncontradas, "mensaje": "Listado de Notificaciones" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener las notificaciones', e);
    }
};
exports.NotificacionesAdmin = NotificacionesAdmin;

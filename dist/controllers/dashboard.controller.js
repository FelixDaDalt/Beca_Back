"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const error_handle_1 = require("../utils/error.handle");
const dashboard_service_1 = require("../services/dashboard.service");
const Dashboard = async (req, res) => {
    try {
        const notificacionesEncontradas = await (0, dashboard_service_1.obtenerResumenDashboard)();
        const data = { "data": notificacionesEncontradas, "mensaje": "Dashboard obtenido" };
        // 6. Enviar la respuesta
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el Dashboard', e);
    }
};
exports.Dashboard = Dashboard;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actividad_log_1 = require("../models/actividad_log");
const database_1 = __importDefault(require("../config/database"));
const registrarActividad = async (req, res, body) => {
    const transaction = await database_1.default.transaction();
    try {
        const { method, originalUrl } = req;
        const idUsuario = req.user?.id;
        const id_rol = req.user?.id_rol;
        const id_colegio = body.idColegio ? body.idColegio : req.user?.id_colegio;
        if (!idUsuario || id_rol === undefined)
            return;
        // Determinar si guardar el ID en usuario_id o admin_id
        const admin_id = id_rol === 0 ? idUsuario : null;
        const usuario_id = id_rol !== 0 ? idUsuario : null;
        // Capturar información adicional de la IP
        let ip = req.headers['x-forwarded-for']
            ? req.headers['x-forwarded-for'].split(',')[0].trim() // Primer IP si hay varias
            : req.socket.remoteAddress; // Dirección real si no hay proxy
        // Si la IP es `::1` (localhost) o `127.0.0.1`, y estamos en el mismo servidor,
        // intentamos tomar la IP real del cliente desde un encabezado personalizado o el frontend
        if (ip === '::1' || ip === '127.0.0.1') {
            ip = req.socket.remoteAddress || req.socket.remoteAddress || ip;
        }
        const navegador = req.headers['user-agent'];
        const queryParams = Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : undefined;
        let mensaje = body?.mensaje ?? 'Sin mensaje';
        mensaje += body?.log ?? 'Sin log';
        const descripcion = `${method} en ${originalUrl} - Resultado: ${mensaje}`;
        const estado = res.statusCode; // Código de respuesta HTTP
        // Registrar solo si la respuesta es exitosa
        if (estado >= 200 && estado < 400) {
            await actividad_log_1.actividad_log.create({
                usuario_id,
                admin_id,
                accion: method,
                descripcion,
                ip,
                navegador,
                query_params: queryParams,
                id_colegio,
                id_rol
            }, { transaction });
            await transaction.commit();
        }
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error registrando actividad:', error);
    }
};
exports.default = registrarActividad;

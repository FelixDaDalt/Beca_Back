import { Request, Response, NextFunction } from 'express';
import { RequestExt } from './session';
import { actividad_log } from '../models/actividad_log';
import sequelize from '../config/database';

const registrarActividad = async (req: RequestExt, res: Response, body: any) => {
    const transaction = await sequelize.transaction();
    try {
        const { method, originalUrl } = req;
        const idUsuario = req.user?.id;
        const id_rol = req.user?.id_rol;
        
        const id_colegio = body.idColegio ? body.idColegio : req.user?.id_colegio;

        if (!idUsuario || id_rol === undefined) return;

        // Determinar si guardar el ID en usuario_id o admin_id
        const admin_id = id_rol === 0 ? idUsuario : null;
        const usuario_id = id_rol !== 0 ? idUsuario : null;
        
        // Capturar información adicional de la IP
        let ip = req.headers['x-forwarded-for'] 
            ? (req.headers['x-forwarded-for'] as string).split(',')[0].trim() // Primer IP si hay varias
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
            await actividad_log.create({
                usuario_id,
                admin_id,
                accion: method,
                descripcion,
                ip,
                navegador,
                query_params: queryParams,
                id_colegio,
                id_rol
            },{ transaction } );
            await transaction.commit();
        }
    } catch (error) {
        await transaction.rollback();
        console.error('Error registrando actividad:', error);
    }
};

export default registrarActividad;



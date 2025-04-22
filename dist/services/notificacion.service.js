"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerNotificaciones = void 0;
const beca_1 = require("../models/beca");
const sequelize_1 = require("sequelize");
const beca_solicitud_1 = require("../models/beca_solicitud");
const colegio_1 = require("../models/colegio");
const notificaciones_1 = require("../models/notificaciones");
const obtenerNotificaciones = async (idUsuario, idRol, idColegio) => {
    try {
        // Si el rol es 0, no tiene notificaciones
        if (idRol === 0) {
            return {
                solicitudesSinLeer: 0,
                misSolicitudesSinLeer: 0,
                total: 0,
                solicitudes: [],
                misSolicitudes: []
            };
        }
        // 🚀 Consultar notificaciones donde el colegio sea oferente o solicitante
        let notificacionesDB = await notificaciones_1.notificaciones.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { id_colegio_ofer: idColegio, leido_ofer: 0 },
                    { id_colegio_solic: idColegio, leido_solic: 0 }
                ]
            },
            include: [
                {
                    model: beca_solicitud_1.beca_solicitud,
                    as: 'id_solicitud_beca_solicitud',
                    include: [{
                            model: beca_1.beca,
                            as: 'id_beca_beca'
                        }]
                },
                {
                    model: colegio_1.colegio,
                    as: 'id_colegio_ofer_colegio'
                },
                {
                    model: colegio_1.colegio,
                    as: 'id_colegio_solic_colegio'
                }
            ],
            order: [['fecha', 'DESC']] // 👈🚀 acá ordenamos por fecha descendente
        });
        // 🔄 Mapear solicitudes
        const solicitudesMapeadas = notificacionesDB
            .filter(n => n.id_colegio_ofer === Number(idColegio))
            .map(n => ({
            id: n.id_solicitud,
            colegio: n.id_colegio_solic_colegio.nombre,
            foto: n.id_colegio_solic_colegio.foto,
            id_red: n.id_solicitud_beca_solicitud.id_beca_beca.id_red,
            vencida: n.vencida,
            porVencer: n.porvencer,
            desestimado: n.desestimada,
            porBaja: n.porbaja,
            dadaDeBaja: n.dadabaja,
            fecha: n.fecha
        }));
        // 🔄 Mapear mis solicitudes
        const misSolicitudesMapeadas = notificacionesDB
            .filter(n => n.id_colegio_solic === Number(idColegio))
            .map(n => ({
            id: n.id_solicitud,
            colegio: n.id_colegio_ofer_colegio.nombre,
            foto: n.id_colegio_ofer_colegio.foto,
            id_red: n.id_solicitud_beca_solicitud.id_beca_beca.id_red,
            vencida: n.vencida,
            porVencer: n.porvencer,
            desestimado: n.desestimada,
            porBaja: n.porbaja,
            dadaDeBaja: n.dadabaja,
            fecha: n.fecha
        }));
        // 📌 Estructura final de la respuesta
        return {
            solicitudesSinLeer: solicitudesMapeadas.length,
            misSolicitudesSinLeer: misSolicitudesMapeadas.length,
            total: solicitudesMapeadas.length + misSolicitudesMapeadas.length,
            solicitudes: solicitudesMapeadas,
            misSolicitudes: misSolicitudesMapeadas
        };
    }
    catch (error) {
        console.error("⚠️ Error en obtenerNotificaciones:", error);
        throw error;
    }
};
exports.obtenerNotificaciones = obtenerNotificaciones;

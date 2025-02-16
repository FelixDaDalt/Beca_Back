"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificaciones = void 0;
const beca_1 = require("../models/beca");
const beca_solicitud_1 = require("../models/beca_solicitud");
const colegio_1 = require("../models/colegio");
const notificaciones = async (idUsuario, idRol, idColegio, transaction) => {
    try {
        let solicitudes = []; // Inicializa solicitudes como un array vacío
        if (idRol == 0) {
            return {
                solicitudesSinLeer: 0,
                misSolicitudesSinLeer: 0,
                total: 0,
                solicitudes: [],
                misSolicitudes: []
            };
        }
        // Si el rol es mayor a 2, ejecuta la consulta de solicitudes
        if (idRol <= 2) {
            solicitudes = await beca_solicitud_1.beca_solicitud.findAll({
                where: {
                    sinLeer: 1
                },
                include: [{
                        model: beca_1.beca,
                        as: 'id_beca_beca',
                        where: {
                            id_colegio: idColegio
                        },
                        required: true
                    }, {
                        model: colegio_1.colegio,
                        as: 'id_colegio_solic_colegio',
                        required: true
                    }],
                transaction
            });
        }
        // Ajusta la consulta de misSolicitudes según el rol
        const misSolicitudes = await beca_solicitud_1.beca_solicitud.findAll({
            where: {
                sinLeerSolicitante: 1,
                ...(idRol > 2 ? { id_usuario_solic: idUsuario } : { id_colegio_solic: idColegio }) // Cambia el filtro según el rol
            },
            include: [{
                    model: beca_1.beca,
                    as: 'id_beca_beca',
                    required: true,
                    include: [{
                            model: colegio_1.colegio,
                            as: 'id_colegio_colegio',
                            required: true
                        }]
                }],
            transaction
        });
        const solicitudesMapeadas = solicitudes.map(s => ({
            vencida: s.id_estado == 4,
            desestimado: s.id_estado == 1,
            id: s.id,
            id_red: s.id_beca_beca?.id_red,
            nombre: s.id_colegio_solic_colegio?.nombre,
            fecha_hora: s.id_estado == 1 ? s.reso_fecha_hora : s.fecha_hora,
            foto: s.id_colegio_solic_colegio?.foto
        }));
        const misSolicitudesMapeadas = misSolicitudes.map(ms => ({
            id: ms.id,
            id_red: ms.id_beca_beca?.id_red,
            nombre: ms.id_beca_beca?.id_colegio_colegio?.nombre,
            reso_fecha_hora: ms.reso_fecha_hora,
            foto: ms.id_beca_beca?.id_colegio_colegio?.foto,
            vencida: ms.id_estado == 4,
        }));
        const notificaciones = {
            solicitudesSinLeer: solicitudesMapeadas.length,
            misSolicitudesSinLeer: misSolicitudesMapeadas.length,
            total: solicitudesMapeadas.length + misSolicitudesMapeadas.length,
            solicitudes: solicitudesMapeadas,
            misSolicitudes: misSolicitudesMapeadas
        };
        return notificaciones;
    }
    catch (error) {
        console.error("Error en la función notificaciones:", error);
        throw error;
    }
};
exports.notificaciones = notificaciones;

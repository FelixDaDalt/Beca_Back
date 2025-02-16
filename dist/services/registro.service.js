"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrosAdmin = exports.registrosPorColegio = void 0;
const usuario_1 = require("./../models/usuario");
const sequelize_1 = require("sequelize");
const actividad_log_1 = require("../models/actividad_log");
const administrador_1 = require("../models/administrador");
const registrosPorColegio = async (idColegio, idRol) => {
    try {
        // Obtener los registros relacionados con el colegio
        const registros = await actividad_log_1.actividad_log.findAll({
            where: {
                id_colegio: idColegio,
                id_rol: {
                    [sequelize_1.Op.gte]: Number(idRol), // idRol debe ser >= al proporcionado
                },
            },
            include: [{
                    model: administrador_1.administrador,
                    as: 'admin',
                    required: false, // Para que no filtre registros sin administrador
                    attributes: ['id', 'nombre', 'apellido'], // Solo los campos que necesitas
                }, {
                    model: usuario_1.usuario,
                    as: 'usuario',
                    required: false, // Para que no filtre registros sin administrador
                    attributes: ['id', 'nombre', 'apellido'], // Solo los campos que necesitas
                }],
            order: [['fecha', 'DESC']], // Ordenar por fecha descendente
        });
        const agrupadosPorRol = registros.reduce((acumulador, registro) => {
            const rolKey = obtenerRol(registro.id_rol).toLowerCase(); // Clave basada en id_rol
            if (!acumulador[rolKey]) {
                acumulador[rolKey] = [];
            }
            acumulador[rolKey].push({
                id: registro.id,
                realizadoPor: registro.usuario_id ?? registro.admin_id, // Determina quién realizó la acción
                descripcion: registro.descripcion,
                fechaHora: registro.fecha,
                ip: registro.ip,
                navegador: registro.navegador,
                accion: registro.accion,
                administrador: registro.admin,
                usuario: registro.usuario
            });
            return acumulador;
        }, {});
        // Responder con los datos organizados
        return agrupadosPorRol;
    }
    catch (error) {
        throw new Error('Error al obtener los registros: ' + error.message);
    }
};
exports.registrosPorColegio = registrosPorColegio;
const registrosAdmin = async () => {
    try {
        // Obtener los registros relacionados con el colegio
        const registros = await actividad_log_1.actividad_log.findAll({
            where: {
                id_rol: 0
            },
            include: [
                {
                    model: administrador_1.administrador, // Asegúrate de importar el modelo de Administrador
                    as: 'admin',
                    required: false, // Para que no filtre registros sin administrador
                    attributes: ['id', 'nombre', 'apellido'], // Solo los campos que necesitas
                }
            ],
            order: [['fecha', 'DESC']], // Ordenar por fecha descendente
        });
        const agrupadosPorRol = registros.reduce((acumulador, registro) => {
            const rolKey = obtenerRol(registro.id_rol).toLowerCase(); // Clave basada en id_rol
            if (!acumulador[rolKey]) {
                acumulador[rolKey] = [];
            }
            acumulador[rolKey].push({
                id: registro.id,
                realizadoPor: registro.usuario_id ?? registro.admin_id, // Determina quién realizó la acción
                descripcion: registro.descripcion,
                fechaHora: registro.fecha,
                ip: registro.ip,
                navegador: registro.navegador,
                accion: registro.accion,
                administrador: registro.admin
            });
            return acumulador;
        }, {});
        // Responder con los datos organizados
        return agrupadosPorRol;
    }
    catch (error) {
        throw new Error('Error al obtener los registros: ' + error.message);
    }
};
exports.registrosAdmin = registrosAdmin;
const obtenerRol = (idRol) => {
    switch (idRol) {
        case 0:
            return 'Administrador';
        case 1:
            return 'Responsable';
        case 2:
            return 'Delegado';
        case 3:
            return 'Autorizado';
        default:
            return 'Desconocido';
    }
};

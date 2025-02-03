"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrosAdmin = exports.registrosPorColegio = exports.registrarEvento = void 0;
const usuario_1 = require("../models/usuario");
const entidad_tipo_1 = require("../models/entidad_tipo");
const registroeventos_1 = require("../models/registroeventos");
const sequelize_1 = require("sequelize");
const colegio_1 = require("../models/colegio");
const red_1 = require("../models/red");
const administrador_1 = require("../models/administrador");
const registrarEvento = async (idUsuario, // ID del usuario o administrador que realiza la acción
idRol, // Rol del usuario que realiza la acción (0 para administrador, otro valor para usuario)
entidadTipoId, // ID del tipo de entidad (e.g., colegio, beca, etc.)
entidadId, // ID de la entidad específica
accion, // Acción realizada (e.g., 'Alta')
descripcion, // Descripción de la actividad realizada
ip, navegador, transaction, idColegio) => {
    try {
        const entidadTipo = await entidad_tipo_1.entidad_tipo.findOne({
            where: { id: entidadTipoId }
        });
        if (!entidadTipo) {
            throw new Error('Tipo de entidad no encontrado: ${entidadTipoId}');
        }
        const registroData = {
            entidad_tipo_id: entidadTipoId,
            entidad_id: entidadId,
            accion,
            descripcion,
            ip,
            navegador,
            fecha_hora: new Date(),
            usuario_id: idRol === 0 ? undefined : idUsuario, // Si es rol de administrador, no asignamos `usuario_id`
            administrador_id: idRol === 0 ? idUsuario : undefined, // Si no es rol de administrador, no asignamos `administrador_id`
            id_rol: idRol,
            id_colegio: idColegio
        };
        // Crear el primer registro de actividad
        await registroeventos_1.registroeventos.create(registroData, { transaction });
    }
    catch (error) {
        throw new Error('Error al registrar el evento: ' + error.message);
    }
};
exports.registrarEvento = registrarEvento;
const registrosPorColegio = async (idColegio, idRol) => {
    try {
        // Obtener los registros relacionados con el colegio
        const registros = await registroeventos_1.registroeventos.findAll({
            where: {
                id_colegio: idColegio,
                id_rol: { [sequelize_1.Op.gte]: idRol }
            },
            attributes: ['id', 'accion', 'descripcion', 'fecha_hora', 'ip', 'navegador', 'entidad_tipo_id', 'entidad_id', 'usuario_id', 'administrador_id', 'id_rol'],
        });
        const registrosConDetalles = await Promise.all(registros.map(async (registro) => {
            // Determinar el modelo a consultar según `entidad_tipo_id`
            let entidadDetalle = null;
            switch (registro.entidad_tipo_id) {
                case 1: // Usuario
                    entidadDetalle = await usuario_1.usuario.findOne({
                        where: { id: registro.entidad_id },
                        attributes: ['nombre', 'apellido'],
                    });
                    break;
                case 2: // Colegio
                    entidadDetalle = await colegio_1.colegio.findOne({
                        where: { id: registro.entidad_id },
                        attributes: ['nombre'],
                    });
                    break;
                case 3: // Red
                    entidadDetalle = await red_1.red.findOne({
                        where: { id: registro.entidad_id },
                        attributes: ['nombre'],
                    });
                    break;
            }
            // Determinar quién realizó el movimiento
            const actor = registro.usuario_id !== null
                ? await usuario_1.usuario.findOne({
                    where: { id: registro.usuario_id },
                    attributes: ['nombre', 'apellido'],
                })
                : await administrador_1.administrador.findOne({
                    where: { id: registro.administrador_id },
                    attributes: ['nombre', 'apellido'],
                });
            const actorNombre = actor ? `${actor.nombre} ${actor.apellido}` : 'Desconocido';
            const entidadNombre = entidadDetalle
                ? `${entidadDetalle.nombre}${'apellido' in entidadDetalle && entidadDetalle.apellido ? ' ' + entidadDetalle.apellido : ''}`
                : 'Entidad desconocida';
            return {
                id: registro.id,
                accion: registro.accion,
                descripcion: registro.descripcion,
                entidad: entidadNombre,
                realizadoPor: actorNombre,
                rol: obtenerRol(registro.id_rol),
                fecha_hora: registro.fecha_hora,
                ip: registro.ip,
                navegador: registro.navegador,
            };
        }));
        // Agrupar por roles
        const agrupadosPorRol = registrosConDetalles.reduce((acumulador, registro) => {
            const rolKey = registro.rol.toLowerCase(); // "administrador", "responsable", etc.
            if (!acumulador[rolKey]) {
                acumulador[rolKey] = [];
            }
            acumulador[rolKey].push({
                id: registro.id,
                realizadoPor: registro.realizadoPor,
                descripcion: registro.descripcion,
                entidad: registro.entidad,
                fechaHora: registro.fecha_hora,
                ip: registro.ip,
                navegador: registro.navegador,
                accion: registro.accion,
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
        const registros = await registroeventos_1.registroeventos.findAll({
            where: {
                id_rol: 0
            },
            attributes: ['id', 'accion', 'descripcion', 'fecha_hora', 'ip', 'navegador', 'entidad_tipo_id', 'entidad_id', 'usuario_id', 'administrador_id', 'id_rol'],
        });
        const registrosConDetalles = await Promise.all(registros.map(async (registro) => {
            // Determinar el modelo a consultar según `entidad_tipo_id`
            let entidadDetalle = null;
            switch (registro.entidad_tipo_id) {
                case 1: // Usuario
                    entidadDetalle = await usuario_1.usuario.findOne({
                        where: { id: registro.entidad_id },
                        attributes: ['nombre', 'apellido'],
                    });
                    break;
                case 2: // Colegio
                    entidadDetalle = await colegio_1.colegio.findOne({
                        where: { id: registro.entidad_id },
                        attributes: ['nombre'],
                    });
                    break;
                case 3: // Red
                    entidadDetalle = await red_1.red.findOne({
                        where: { id: registro.entidad_id },
                        attributes: ['nombre'],
                    });
                    break;
            }
            // Determinar quién realizó el movimiento
            const actor = await administrador_1.administrador.findOne({
                where: { id: registro.administrador_id },
                attributes: ['nombre', 'apellido'],
            });
            const actorNombre = actor ? `${actor.nombre} ${actor.apellido}` : 'Desconocido';
            const entidadNombre = entidadDetalle
                ? `${entidadDetalle.nombre}${'apellido' in entidadDetalle && entidadDetalle.apellido ? ' ' + entidadDetalle.apellido : ''}`
                : 'Entidad desconocida';
            return {
                id: registro.id,
                accion: registro.accion,
                descripcion: registro.descripcion,
                entidad: entidadNombre,
                realizadoPor: actorNombre,
                rol: obtenerRol(registro.id_rol),
                fecha_hora: registro.fecha_hora,
                ip: registro.ip,
                navegador: registro.navegador,
            };
        }));
        // Agrupar por roles
        const agrupadosPorRol = registrosConDetalles.reduce((acumulador, registro) => {
            const rolKey = registro.rol.toLowerCase(); // "administrador", "responsable", etc.
            if (!acumulador[rolKey]) {
                acumulador[rolKey] = [];
            }
            acumulador[rolKey].push({
                id: registro.id,
                realizadoPor: registro.realizadoPor,
                descripcion: registro.descripcion,
                entidad: registro.entidad,
                fechaHora: registro.fecha_hora,
                ip: registro.ip,
                navegador: registro.navegador,
                accion: registro.accion,
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

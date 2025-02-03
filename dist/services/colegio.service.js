"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editarColegio = exports.borrarColegio = exports.detalleColegio = exports.altaColegio = exports.listadoColegios = exports.suspenderColegio = exports.obtenerColegio = void 0;
const usuario_1 = require("../models/usuario");
const colegio_1 = require("../models/colegio");
const password_handle_1 = require("../utils/password.handle");
const zona_localidad_1 = require("../models/zona_localidad");
const zona_1 = require("../models/zona");
const red_1 = require("../models/red");
const red_colegio_1 = require("../models/red_colegio");
const obtenerColegio = async (idColegio) => {
    try {
        const colegioEncontrado = await colegio_1.colegio.findOne({
            where: {
                id: idColegio,
                borrado: 0
            },
            attributes: { exclude: ['borrado'] },
            include: [{
                    model: zona_localidad_1.zona_localidad,
                    as: 'id_zona_zona_localidad',
                    required: false,
                    include: [{
                            model: zona_1.zona,
                            as: 'id_zona_zona',
                            required: false
                        }]
                }]
        });
        if (!colegioEncontrado) {
            const error = new Error('No se encontro ningun colegio asociado');
            error.statusCode = 409;
            throw error;
        }
        return colegioEncontrado;
    }
    catch (error) {
        throw error;
    }
};
exports.obtenerColegio = obtenerColegio;
const altaColegio = async (altaColegio, transaction) => {
    try {
        // 1. Verificar si el colegio existe por CUIT
        const colegioExistente = await colegio_1.colegio.findOne({
            where: {
                cuit: altaColegio.colegio.cuit,
                borrado: 0
            },
            transaction,
        });
        if (colegioExistente) {
            const error = new Error('El Cuit del colegio ya se encuentra registrado');
            error.statusCode = 409;
            throw error;
        }
        // 2. Verificar si el usuario existe por DNI
        const usuarioExistente = await usuario_1.usuario.findOne({
            where: {
                dni: altaColegio.usuario.dni,
                borrado: 0
            },
            transaction,
        });
        if (usuarioExistente) {
            const error = new Error('El Dni ya se encuentra registrado');
            error.statusCode = 409;
            throw error;
        }
        // 3. Dar de alta el colegio
        const nuevoColegio = await colegio_1.colegio.create(altaColegio.colegio, { transaction });
        // 4. Usar el id del colegio recién creado para dar de alta el usuario
        //Encriptar contraseña
        const passEncrypt = await (0, password_handle_1.encriptar)(altaColegio.usuario.password);
        const nuevoUsuario = await usuario_1.usuario.create({
            ...altaColegio.usuario,
            password: passEncrypt,
            id_rol: 1,
            id_colegio: nuevoColegio.id
        }, { transaction });
        // 7. Retornar
        const { borrado: borradoColegio, ...responseColegio } = nuevoColegio.dataValues;
        const { password, borrado: borradoUsuario, id_rol, id_colegio, ...responseUsuario } = nuevoUsuario.dataValues;
        return {
            colegio: {
                responseColegio
            },
            responsable: {
                responseUsuario
            }
        };
    }
    catch (error) {
        throw error;
    }
};
exports.altaColegio = altaColegio;
const editarColegio = async (editar, transaction) => {
    try {
        // 1. Verificar si el colegio existe por CUIT
        const colegioExistente = await colegio_1.colegio.findOne({
            where: {
                id: editar.id,
                borrado: 0
            },
            transaction,
        });
        if (!colegioExistente) {
            const error = new Error('El colegio no existe');
            error.statusCode = 409;
            throw error;
        }
        const estadoAnterior = { ...colegioExistente.toJSON() };
        await colegio_1.colegio.update(editar, {
            where: { id: editar.id },
            transaction,
        });
        return { editar, estadoAnterior };
    }
    catch (error) {
        throw error;
    }
};
exports.editarColegio = editarColegio;
const suspenderColegio = async (idColegio, transaction) => {
    // Inicia la transacción
    try {
        if (idColegio) {
            // 1. Verificar si el colegio existe por CUIT
            const colegioExistente = await colegio_1.colegio.findOne({
                where: {
                    id: idColegio,
                    borrado: 0
                },
                attributes: { exclude: ['borrado'] },
                include: [{
                        model: usuario_1.usuario,
                        as: 'usuarios',
                        where: {
                            id_rol: 1,
                            borrado: 0
                        },
                        attributes: { exclude: ['password', 'borrado', 'id_rol'] },
                    }],
                transaction,
            });
            if (!colegioExistente) {
                const error = new Error('No se encontro el colegio');
                error.statusCode = 409;
                throw error;
            }
            // Cambia el estado de suspensión del colegio
            colegioExistente.suspendido = colegioExistente.suspendido ? 0 : 1;
            // Guarda el cambio en la base de datos
            await colegioExistente.save({ transaction });
            return colegioExistente;
        }
        const error = new Error('Se debe proporcionar el ID de colegio para Suspenderlo.');
        error.statusCode = 400;
        throw error;
    }
    catch (error) {
        throw error;
    }
};
exports.suspenderColegio = suspenderColegio;
const listadoColegios = async () => {
    try {
        const listado = await colegio_1.colegio.findAll({
            where: {
                borrado: 0
            },
            attributes: { exclude: ['borrado'] },
            include: [{
                    model: usuario_1.usuario,
                    as: 'usuarios',
                    where: {
                        id_rol: 1,
                        borrado: 0
                    },
                    attributes: { exclude: ['password', 'borrado', 'id_rol'] },
                }]
        });
        return listado;
    }
    catch (error) {
        throw error;
    }
};
exports.listadoColegios = listadoColegios;
const detalleColegio = async (idColegio) => {
    try {
        const colegioExistente = await colegio_1.colegio.findOne({
            where: {
                id: idColegio,
                borrado: 0,
            },
            attributes: { exclude: ['borrado'] },
            include: [
                {
                    model: usuario_1.usuario,
                    as: 'usuarios',
                    where: { borrado: 0 },
                    attributes: ['id', 'dni', 'nombre', 'apellido', 'id_rol', 'suspendido', 'foto'],
                    required: false
                },
                {
                    model: zona_localidad_1.zona_localidad,
                    as: 'id_zona_zona_localidad',
                    required: false,
                    attributes: { exclude: ['borrado'] },
                    include: [{
                            model: zona_1.zona,
                            as: 'id_zona_zona',
                            required: false,
                            attributes: { exclude: ['borrado'] }
                        }]
                },
                {
                    model: red_colegio_1.red_colegio, // Incluir la tabla intermedia 'red_colegio'
                    as: 'red_colegios', // Alias para las redes
                    where: { id_colegio: idColegio, borrado: 0 }, // Filtrar por el colegio
                    include: [
                        {
                            model: red_1.red, // Incluir el modelo de redes
                            as: 'id_red_red', // Alias para la red
                            where: { borrado: 0 },
                            attributes: ['id', 'nombre', 'porcentaje', 'foto', 'caracteristicas'], // Incluir datos relevantes de la red
                        }
                    ]
                }
            ]
        });
        if (!colegioExistente) {
            const error = new Error('No se encontró el colegio');
            error.statusCode = 409;
            throw error;
        }
        // Clasificar los usuarios según el id_rol
        const usuarios = colegioExistente.usuarios.reduce((acc, user) => {
            if (user.id_rol === 1) {
                acc.responsables.push(user);
            }
            else if (user.id_rol === 2) {
                acc.delegados.push(user);
            }
            else if (user.id_rol === 3) {
                acc.autorizados.push(user);
            }
            return acc;
        }, { responsables: [], delegados: [], autorizados: [] });
        // Extraer la información de las redes desde la tabla intermedia 'red_colegio'
        const redesRelacionadas = colegioExistente.red_colegios.map((redRel) => ({
            red: redRel.id_red_red, // Obtener la red completa
            anfitrion: redRel.anfitrion // Obtener si es anfitrión o no
        }));
        // Filtrar las redes donde el colegio es anfitrión
        const redesAnfitrion = redesRelacionadas
            .filter((rc) => rc.anfitrion === true)
            .map((rc) => rc.red); // Extraer solo la información de la red
        // Filtrar las redes donde el colegio es solo miembro
        const redesMiembro = redesRelacionadas
            .filter((rc) => rc.anfitrion === false)
            .map((rc) => rc.red); // Extraer solo la información de la red
        // Estructura de respuesta
        const { usuarios: _, redes: __, ...colegioSinUsuarios } = colegioExistente.toJSON();
        return {
            colegio: colegioSinUsuarios,
            usuarios: usuarios,
            anfitrion: redesAnfitrion, // Redes donde el colegio es anfitrión
            miembro: redesMiembro // Redes donde el colegio es solo miembro
        };
    }
    catch (error) {
        throw error;
    }
};
exports.detalleColegio = detalleColegio;
const borrarColegio = async (idColegio, transaction) => {
    try {
        const colegioExistente = await colegio_1.colegio.findOne({
            where: { id: idColegio, borrado: 0 },
            include: [{
                    model: usuario_1.usuario,
                    as: 'usuarios',
                }],
            transaction,
        });
        if (!colegioExistente) {
            const error = new Error('No se encontro el colegio');
            error.statusCode = 409;
            throw error;
        }
        colegioExistente.borrado = 1;
        await colegioExistente.save({ transaction });
        if (colegioExistente.usuarios && colegioExistente.usuarios.length > 0) {
            for (const usuario of colegioExistente.usuarios) {
                usuario.borrado = 1;
                await usuario.save({ transaction });
            }
        }
        return colegioExistente;
    }
    catch (error) {
        throw error;
    }
};
exports.borrarColegio = borrarColegio;

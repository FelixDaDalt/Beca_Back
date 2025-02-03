"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listadoResponsables = exports.altaResponsable = void 0;
const password_handle_1 = require("../utils/password.handle");
const usuario_1 = require("../models/usuario");
const colegio_1 = require("../models/colegio");
const zona_localidad_1 = require("../models/zona_localidad");
const sequelize_1 = require("sequelize");
///RESPONSABLES////
const altaResponsable = async (nuevoResponsable, transaction) => {
    try {
        // 1. Verificar si el usuario existe por DNI
        const usuarioExistente = await usuario_1.usuario.findOne({
            where: {
                dni: nuevoResponsable.dni,
                borrado: 0
            },
            transaction,
        });
        if (usuarioExistente) {
            const error = new Error('El Dni ya se encuentra registrado');
            error.statusCode = 400;
            throw error;
        }
        // 2. Encriptar contraseña
        const passEncrypt = await (0, password_handle_1.encriptar)(nuevoResponsable.password);
        nuevoResponsable.password = passEncrypt;
        // 3. Agregar el responsable
        nuevoResponsable.id_rol = 1;
        nuevoResponsable.cambiarPass = 1;
        const agregarResponsable = await usuario_1.usuario.create(nuevoResponsable, { transaction }); // Incluye la transacción
        // 5. Devolver el token y los datos del usuario al cliente
        const { password, borrado, id_rol, ...responsableRegistrado } = agregarResponsable.dataValues;
        return { ...responsableRegistrado };
    }
    catch (error) {
        throw error;
    }
};
exports.altaResponsable = altaResponsable;
const listadoResponsables = async (idConsulta, idColegio) => {
    try {
        const whereCondicion = idColegio
            ? { id_colegio: idColegio, id_rol: 1, borrado: 0, id: { [sequelize_1.Op.ne]: idConsulta } }
            : { id_rol: 1, borrado: 0, id: { [sequelize_1.Op.ne]: idConsulta } };
        const listado = await usuario_1.usuario.findAll({
            where: whereCondicion,
            attributes: { exclude: ['borrado', 'password', 'id_colegio'] },
            include: [{
                    model: colegio_1.colegio,
                    as: 'id_colegio_colegio',
                    required: false,
                    include: [{
                            model: zona_localidad_1.zona_localidad,
                            as: 'zona_localidad',
                            required: false,
                        }],
                    attributes: { exclude: ['logo', 'borrado'] },
                }]
        });
        return listado;
    }
    catch (error) {
        throw error;
    }
};
exports.listadoResponsables = listadoResponsables;

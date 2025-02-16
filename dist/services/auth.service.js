"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcryptjs_1 = require("bcryptjs");
const jw_handle_1 = require("../utils/jw.handle");
const administrador_1 = require("../models/administrador");
const usuario_1 = require("../models/usuario");
const colegio_1 = require("../models/colegio");
const roles_1 = require("../models/roles");
const login = async (login, tipo, ip, navegador) => {
    try {
        let usuarioExistente;
        if (tipo === 'administrador') {
            usuarioExistente = await administrador_1.administrador.findOne({
                where: { dni: login.dni, borrado: 0 },
                include: [{
                        model: roles_1.roles,
                        as: 'id_rol_role',
                        attributes: ['descripcion'],
                        required: false
                    }]
            });
        }
        else if (tipo === 'usuario') {
            usuarioExistente = await usuario_1.usuario.findOne({
                where: { dni: login.dni, borrado: 0 },
                include: [
                    {
                        model: colegio_1.colegio,
                        as: 'id_colegio_colegio',
                        attributes: ['suspendido', 'nombre'],
                        required: true
                    },
                    {
                        model: roles_1.roles,
                        as: 'id_rol_role',
                        attributes: ['descripcion'],
                        required: true
                    }
                ]
            });
        }
        else {
            throw new Error('Tipo de usuario no válido');
        }
        // 2. Lanzar un error si el usuario no existe
        if (!usuarioExistente) {
            const error = new Error('Usuario incorrecto');
            error.statusCode = 400;
            throw error;
        }
        // 3. Validar la contraseña
        const contraseñaValida = await compararContraseña(login.password, usuarioExistente.password);
        if (!contraseñaValida) {
            const error = new Error('Contraseña incorrecta');
            error.statusCode = 400;
            throw error;
        }
        const id_colegio = tipo === 'usuario' && 'id_colegio' in usuarioExistente
            ? usuarioExistente.id_colegio
            : null;
        // 4. Generar el token JWT
        const token = await (0, jw_handle_1.generarToken)(usuarioExistente.id, usuarioExistente.id_rol, usuarioExistente.dni, id_colegio);
        // 6. Excluir datos sensibles y retornar el token y los datos
        const { password, borrado, ...usuarioLogueado } = usuarioExistente.dataValues;
        return {
            token,
            datos: usuarioLogueado
        };
    }
    catch (error) {
        throw error;
    }
};
exports.login = login;
const compararContraseña = async (password, passwordHash) => {
    return await (0, bcryptjs_1.compare)(password, passwordHash);
};

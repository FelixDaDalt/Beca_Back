"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcryptjs_1 = require("bcryptjs");
const jw_handle_1 = require("../utils/jw.handle");
const administrador_1 = require("../models/administrador");
const usuario_1 = require("../models/usuario");
const colegio_1 = require("../models/colegio");
const roles_1 = require("../models/roles");
const ingresos_usuarios_1 = require("../models/ingresos_usuarios");
const ingresos_administradores_1 = require("../models/ingresos_administradores");
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
            await registrarIngresoUsuario(tipo, 'fallido', ip, navegador, login.dni); // Usar `null` en lugar de `usuarioExistente.id`
            const error = new Error('Usuario incorrecto');
            error.statusCode = 400;
            throw error;
        }
        // 3. Validar la contraseña
        const contraseñaValida = await compararContraseña(login.password, usuarioExistente.password);
        if (!contraseñaValida) {
            await registrarIngresoUsuario(tipo, 'fallido', ip, navegador, login.dni, usuarioExistente.id);
            const error = new Error('Contraseña incorrecta');
            error.statusCode = 400;
            throw error;
        }
        const id_colegio = tipo === 'usuario' && 'id_colegio' in usuarioExistente
            ? usuarioExistente.id_colegio
            : null;
        // 4. Generar el token JWT
        const token = await (0, jw_handle_1.generarToken)(usuarioExistente.id, usuarioExistente.id_rol, usuarioExistente.dni, id_colegio);
        // 5. Registrar el ingreso exitoso
        await registrarIngresoUsuario(tipo, 'exitoso', ip, navegador, login.dni, usuarioExistente.id);
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
const registrarIngresoUsuario = async (tipo, estado, ip, navegador, dni_ingresado, usuarioId) => {
    if (tipo == "administrador") {
        await ingresos_administradores_1.ingresos_administradores.create({
            id_usuario: usuarioId, // Asegúrate de que usuarioId sea nulo si no está disponible
            fecha_hora: new Date(),
            ip,
            navegador,
            dni_ingresado,
            estado
        });
    }
    else if (tipo == "usuario") {
        await ingresos_usuarios_1.ingresos_usuarios.create({
            id_usuario: usuarioId, // Lo mismo aquí
            fecha_hora: new Date(),
            ip,
            navegador,
            dni_ingresado,
            estado
        });
    }
};
const compararContraseña = async (password, passwordHash) => {
    return await (0, bcryptjs_1.compare)(password, passwordHash);
};

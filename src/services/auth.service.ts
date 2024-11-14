import { compare } from "bcryptjs"
import { generarToken } from "../utils/jw.handle"
import { administrador } from "../models/administrador"
import { usuario } from "../models/usuario"
import { colegio } from "../models/colegio"
import { roles } from "../models/roles"
import { ingresos_usuarios } from "../models/ingresos_usuarios"
import { ingresos_administradores } from "../models/ingresos_administradores"
import sequelize from "../config/database"


interface nuevoLogin{
    dni:string,
    password:string
}



const login = async (login: nuevoLogin, tipo: string, ip: string, navegador: string) => {
    try {
        let usuarioExistente;
        if (tipo === 'administrador') {
            usuarioExistente = await administrador.findOne({
                where: { dni: login.dni, borrado: 0 },
                include: [{
                    model: roles,
                    as: 'id_rol_role',
                    attributes: ['descripcion'],
                    required: false
                }]
            });
        } else if (tipo === 'usuario') {
            usuarioExistente = await usuario.findOne({
                where: { dni: login.dni, borrado: 0 },
                include: [
                    {
                        model: colegio,
                        as: 'id_colegio_colegio',
                        attributes: ['suspendido', 'nombre'],
                        required: true
                    },
                    {
                        model: roles,
                        as: 'id_rol_role',
                        attributes: ['descripcion'],
                        required: true
                    }
                ]
            });
        } else {
            throw new Error('Tipo de usuario no válido');
        }

        // 2. Lanzar un error si el usuario no existe
        if (!usuarioExistente) {
            await registrarIngresoUsuario(tipo, 'fallido', ip, navegador,login.dni);  // Usar `null` en lugar de `usuarioExistente.id`
            const error = new Error('Usuario incorrecto');
            (error as any).statusCode = 400;
            throw error;
        }

        // 3. Validar la contraseña
        const contraseñaValida = await compararContraseña(login.password, usuarioExistente.password);
        if (!contraseñaValida) {
            await registrarIngresoUsuario(tipo, 'fallido', ip, navegador, login.dni,usuarioExistente.id);
            const error = new Error('Contraseña incorrecta');
            (error as any).statusCode = 400;
            throw error;
        }

        const id_colegio = tipo === 'usuario' && 'id_colegio' in usuarioExistente
            ? usuarioExistente.id_colegio
            : null;

        // 4. Generar el token JWT
        const token = await generarToken(usuarioExistente.id, usuarioExistente.id_rol, usuarioExistente.dni, id_colegio);

        // 5. Registrar el ingreso exitoso
        await registrarIngresoUsuario(tipo, 'exitoso', ip, navegador,login.dni, usuarioExistente.id);

        // 6. Excluir datos sensibles y retornar el token y los datos
        const { password, borrado, ...usuarioLogueado } = usuarioExistente.dataValues;
        return {
            token,
            datos: usuarioLogueado
        };

    } catch (error) {
        throw error;
    }
};


const registrarIngresoUsuario = async (tipo: string, estado: "exitoso" | "fallido", ip: string, navegador: string, dni_ingresado:string, usuarioId?: number) => {
    if (tipo == "administrador") {
        await ingresos_administradores.create({
            id_usuario: usuarioId,  // Asegúrate de que usuarioId sea nulo si no está disponible
            fecha_hora: new Date(),
            ip,
            navegador,
            dni_ingresado,
            estado
        });
    } else if (tipo == "usuario") {
        await ingresos_usuarios.create({
            id_usuario: usuarioId,  // Lo mismo aquí
            fecha_hora: new Date(),
            ip,
            navegador,
            dni_ingresado,
            estado
        });
    }
};

const compararContraseña = async (password: string, passwordHash: string) => {
    return await compare(password, passwordHash);
}

export{login}
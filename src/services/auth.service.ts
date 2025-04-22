import { compare } from "bcryptjs"
import { generarToken } from "../utils/jw.handle"
import { administrador } from "../models/administrador"
import { usuario } from "../models/usuario"
import { colegio } from "../models/colegio"
import { roles } from "../models/roles"


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
           
            const error = new Error('Usuario incorrecto');
            (error as any).statusCode = 400;
            throw error;
        }

        // 3. Validar la contraseña
        const contraseñaValida = await compararContraseña(login.password, usuarioExistente.password);
        if (!contraseñaValida) {
           
            const error = new Error('Contraseña incorrecta');
            (error as any).statusCode = 400;
            throw error;
        }

        const id_colegio = tipo === 'usuario' && 'id_colegio' in usuarioExistente
            ? usuarioExistente.id_colegio
            : null;
        
        const superAdmin = tipo === 'administrador' && 'superAdmin' in usuarioExistente
            ? usuarioExistente.superAdmin
            : null

        // 4. Generar el token JWT
        const token = await generarToken(usuarioExistente.id, usuarioExistente.id_rol, usuarioExistente.dni, id_colegio,superAdmin);

    
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




const compararContraseña = async (password: string, passwordHash: string) => {
    return await compare(password, passwordHash);
}

export{login}
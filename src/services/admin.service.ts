import { encriptar } from "../utils/password.handle"
import { administrador } from "../models/administrador"
import { colegio } from "../models/colegio"
import { usuario } from "../models/usuario"
import { tyc } from "../models/tyc"
import { Op, Transaction } from "sequelize"
import { roles } from "../models/roles"

const altaAdministrador = async (nuevoAdmin: administrador, transaction: Transaction) => {
    try {
        // 1. Verificar si el usuario existe por DNI
        const administradorExistente = await administrador.findOne({
            where: {
                dni: nuevoAdmin.dni,
                borrado: 0
            },
            transaction, 
        });

  
        if (administradorExistente) {
            const error = new Error('El Dni ya se encuentra registrado');
            (error as any).statusCode = 400; 
            throw error;
        }

        // 2. Encriptar contraseña
        const passEncrypt = await encriptar(nuevoAdmin.password);
        nuevoAdmin.password = passEncrypt;
        nuevoAdmin.cambiarPass = 1;

        // 3. Agregar el administrador
        const agregarAdmin = await administrador.create(nuevoAdmin, { transaction }); // Incluye la transacción

        // 5. Devolver el token y los datos del usuario al cliente
        const { password, borrado, ...administradorRegistrado } = agregarAdmin.dataValues;

        return {...administradorRegistrado};
    } catch (error) {
        throw error;
    }
};

const listadoAdministradores = async (idConsulta:string) => {
    try {
        const listado = await administrador.findAll({
            where: {
                borrado: 0,
                id: { [Op.ne]: idConsulta }
            },
            attributes: { exclude: ['borrado'] },
        });

        return listado;
    } catch (error) {
        throw error;
    }
};

const suspenderAdministrador = async (idRol:number, idUsuario:string, transaction:Transaction) => {
        
    try {

        const adminExistente = await administrador.findOne({
            where:{
                id:idUsuario,
                borrado:0
            }
        })

        if(!adminExistente){
            const error = new Error('El Usuario no existe');
            (error as any).statusCode = 400; 
            throw error;
        }

        if(idRol > adminExistente.id_rol){
            const error = new Error('No tiene permisos para suspender al usuario');
            (error as any).statusCode = 400; 
            throw error;
        }

        // Cambiar estado de suspensión
        adminExistente.suspendido = adminExistente.suspendido == 1 ? 0 : 1;
        
        // Guardar cambios
        await adminExistente.save({ transaction });

        // 4. Retornar
        return adminExistente

    } catch (error) {
        throw error;
    }
};

const borrarAdministrador = async (idRol:number, idUsuario:string, transaction:Transaction) => {
        
    try {

        const adminExistente = await administrador.findOne({
            where:{
                id:idUsuario,
                borrado:0
            }
        })

        if(!adminExistente){
            const error = new Error('El Usuario no existe');
            (error as any).statusCode = 400; 
            throw error;
        }

        if(idRol > adminExistente.id_rol){
            const error = new Error('No tiene permisos para eliminar al usuario');
            (error as any).statusCode = 400; 
            throw error;
        }

        const usuariosAdmin = await administrador.count({
            where: {
                id_rol: 0,
                borrado: 0
            }
        });

        if (usuariosAdmin === 1) {
            const error = new Error('No se puede eliminar el único usuario Administrador');
            (error as any).statusCode = 400;
            throw error;
        }

        // Cambiar estado de suspensión
        adminExistente.borrado = 1;
        
        // Guardar cambios
        await adminExistente.save({ transaction });

        // 4. Retornar
        return adminExistente

    } catch (error) {
        throw error;
    }
};

const obtenerAdministrador = async (idUsuario:string) => {
    try {

        const administradorExistente = await administrador.findOne({
            where:[{
                id:idUsuario,
                borrado:0
            }],
            attributes:{exclude:['borrado','password']}
        });

        if (!administradorExistente) {
            const error = new Error('Usuario inexistente');
            (error as any).statusCode = 400;
            throw error;
        }

        return administradorExistente
        
    } catch (error) {
        throw error;
    }
};

const actualizar = async (update:administrador, idUsuario:number, transaction:Transaction) => {
    try {

        if(update.id != idUsuario){
            const error = new Error('No puedes editar otro usuario');
            (error as any).statusCode = 400; 
            throw error;
        }

        const usuarioExistente = await administrador.findOne({
            where:{
                id:update.id,
                borrado:0
            }
        })

        if(!usuarioExistente){
            const error = new Error('El Usuario no existe');
            (error as any).statusCode = 400; 
            throw error;
        }

        const estadoAnterior = { ...usuarioExistente.toJSON() };

        await administrador.update(update, {
            where: { id: update.id },
            transaction,
        });

        // 4. Retornar
        return update

    } catch (error) {
        throw error;
    }
};

const me = async (idUsuario:string) => {
    try {

        const usuarioExistente = await administrador.findOne({
            where:[{
                id:idUsuario,
                borrado:0
            }],
            attributes:{exclude:['borrado','password']},
            include:[{
                    model:roles,
                    as:'id_rol_role',
                    required:false,
                    attributes:['descripcion']
            }]
        });

        if (!usuarioExistente) {
            const error = new Error('Usuario inexistente');
            (error as any).statusCode = 400;
            throw error;
        }

        return usuarioExistente
        
    } catch (error) {
        throw error;
    }
}

const comprobarDisponibilidad = async (cuit?: string, dni?: string, url?: string, dniAdmin?:string) => {
    try{
        let resultado: { disponible: boolean } = {disponible:false};

        if (cuit) {
            const findCuit = await colegio.findOne({ where: { cuit,borrado:0 } });
            resultado.disponible = !findCuit; // Si no existe, es disponible
            return resultado
        }
    
        if (dni) {
            const findDni = await usuario.findOne({ where: { dni,borrado:0 } });
            resultado.disponible = !findDni; // Si no existe, es disponible
            return resultado
        }
    
        if (url) {
            const findUrl = await colegio.findOne({ where: { url } });
            resultado.disponible = !findUrl; // Si no existe, es disponible
            return resultado
        }

        if (dniAdmin) {
            const dni = dniAdmin
            const findDniAdmin = await administrador.findOne({ where: { dni,borrado:0 } });
            resultado.disponible = !findDniAdmin; // Si no existe, es disponible
            return resultado
        }

        const error = new Error('Se debe proporcionar CUIT, DNI o URL para comprobar la disponibilidad.');
        (error as any).statusCode = 400; 
        throw error;

    } catch (error) {
        throw error;
    }
    
}

const nuevoTyc = async (nuevoTyc: tyc, transaction:Transaction) => {
    try {
        
        // 1. Dar de alta los terminos
        const nuevo = await tyc.create(nuevoTyc, { transaction });

        // 2. Actualizar todos los usuarios a `tyc: 0`
        await usuario.update({ tyc: 0 }, { where: {}, transaction });

        // 5. Retornar
        return nuevo

    } catch (error) {
        throw error;
    }
};

const listadoTyc = async () => {
    try {
        // Obtener todos los términos ordenados por 'id' en orden descendente
        const listado = await tyc.findAll({
            order: [['id', 'DESC']]
        });
        return listado;
    } catch (error) {
        throw error;
    }
};

export{listadoTyc, nuevoTyc, altaAdministrador,comprobarDisponibilidad, listadoAdministradores,suspenderAdministrador, obtenerAdministrador, borrarAdministrador,me,actualizar}
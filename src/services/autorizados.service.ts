import { encriptar } from "../utils/password.handle";
import { usuario } from "../models/usuario";
import sequelize from "../config/database";
import { Op, Transaction } from "sequelize";
import { autorizados } from "../models/autorizados";



const altaAutorizado = async (idColegio:number, nuevoAutorizado: usuario,transaction:Transaction) => {

    try {
        // 1. Verificar si el usuario existe por DNI
        const autorizadoExistente = await autorizados.findOne({
            where: {
                dni: nuevoAutorizado.dni,
                id_colegio:idColegio,
                borrado: 0
            },
            transaction, 
        });

  
        if (autorizadoExistente) {
            const error = new Error('El Dni ya se encuentra registrado en el colegio');
            (error as any).statusCode = 400; 
            throw error;
        }


        // 3. Agregar el colegio
        nuevoAutorizado.id_colegio = idColegio;
 
        const agregarAutorizado = await autorizados.create(nuevoAutorizado, { transaction }); // Incluye la transacción

        // 5. Devolver el token y los datos del usuario al cliente
        const { borrado, ...AutorizadoRegistrado} = agregarAutorizado.dataValues;

        return {...AutorizadoRegistrado}    
        
    } catch (error) {

        throw error;
    }
};

const listadoAutorizados = async (idConsulta:string, id_colegio:number) => {
    try {
        const listado = await autorizados.findAll({
            where: {
                id_colegio:id_colegio,
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

const obtenerAutorizado = async (idAutorizado:string) => {
    try {

        const autorizadoExistente = await autorizados.findOne({
            where:[{
                id:idAutorizado,
                borrado:0
            }],
            attributes:{exclude:['borrado']}
        });

        if (!autorizadoExistente) {
            const error = new Error('Usuario inexistente');
            (error as any).statusCode = 400;
            throw error;
        }

        return autorizadoExistente
        
    } catch (error) {
        throw error;
    }
};

const editarAutorizado = async (update:autorizados, idUsuario:number, idRol:number, transaction:Transaction, idColegio?:number) => {
    try {
        if(idRol > 1 && update.id != idUsuario){
            const error = new Error('No puedes editar otro usuario');
            (error as any).statusCode = 400; 
            throw error;
        }

        const autorizadoExistente = await autorizados.findOne({
            where:{
                id:update.id,
                borrado:0
            }
        })

        if(!autorizadoExistente){
            const error = new Error('El Usuario no existe');
            (error as any).statusCode = 400; 
            throw error;
        }

        if(idRol == 1 && autorizadoExistente.id_colegio != idColegio){
            const error = new Error('No puedes editar el usuario de otro colegio');
            (error as any).statusCode = 400; 
            throw error;
        }

        const estadoAnterior = { ...autorizadoExistente.toJSON() };

        await autorizados.update(update, {
            where: { id: update.id },
            transaction,
        });

        // 4. Retornar
        return update

    } catch (error) {
        throw error;
    }
};

const suspenderAutorizado = async (idUsuario:string, idColegio:string, transaction:Transaction) => { 
    try {

        const autorizadoExistente = await autorizados.findOne({
            where:{
                id:idUsuario,
                id_colegio:idColegio,
                borrado:0
            }
        })

        if(!autorizadoExistente){
            const error = new Error('El Autorizado no existe');
            (error as any).statusCode = 400; 
            throw error;
        }


        // Cambiar estado de suspensión
        autorizadoExistente.suspendido = autorizadoExistente.suspendido == 1 ? 0 : 1;
        
        // Guardar cambios
        await autorizadoExistente.save({ transaction });

        // 4. Retornar
        return autorizadoExistente

    } catch (error) {
        throw error;
    }
};

const borrarAutorizado = async (idUsuario:string, idColegio:string,transaction:Transaction) => {
        
    try {

        const autorizadoExistente = await autorizados.findOne({
            where:{
                id:idUsuario,
                id_colegio:idColegio,
                borrado:0
            }
        })

        if(!autorizadoExistente){
            const error = new Error('El Autorizado no existe');
            (error as any).statusCode = 400; 
            throw error;
        }

        // Cambiar estado de suspensión
        autorizadoExistente.borrado = 1;
        
        // Guardar cambios
        await autorizadoExistente.save({ transaction });

        // 4. Retornar
        return autorizadoExistente

    } catch (error) {
        throw error;
    }
};



export{altaAutorizado,listadoAutorizados,obtenerAutorizado,editarAutorizado, suspenderAutorizado,borrarAutorizado }
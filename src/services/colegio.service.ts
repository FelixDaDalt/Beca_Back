import { usuario } from "../models/usuario";
import { colegio } from "../models/colegio"
import sequelize from "../config/database";
import { encriptar } from "../utils/password.handle";
import { zona_localidad } from "../models/zona_localidad";
import { zona } from "../models/zona";
import { Transaction } from "sequelize";

interface nuevoColegio{
    colegio:colegio
    usuario:usuario
}

const obtenerColegio = async (idColegio:string) => {
    try {
        const colegioEncontrado = await colegio.findOne({
            where: {
                id:idColegio,
                borrado: 0
            },
            attributes: { exclude: ['borrado'] },
            include:[{
                model:zona_localidad,
                as:'zona_localidad',
                required:false,
                include:[{
                    model:zona,
                    as:'zona',
                    required:false
                }]
            }]
        });

        if (!colegioEncontrado) {
            const error = new Error('No se encontro ningun colegio asociado');
            (error as any).statusCode = 409; 
            throw error;
        }


        // Convertir logo a base64 para cada colegio
        if (colegioEncontrado && colegioEncontrado.logo) {
            colegioEncontrado.logo = Buffer.from(colegioEncontrado.logo).toString('base64');
        }

        return colegioEncontrado;

    } catch (error) {
        throw error;
    }
};

const altaColegio = async (altaColegio: nuevoColegio, transaction:Transaction) => {

    try {
        // 1. Verificar si el colegio existe por CUIT
        const colegioExistente = await colegio.findOne({
            where: {
                cuit: altaColegio.colegio.cuit,
                borrado: 0
            },
            transaction,
        });

  
        if (colegioExistente) {
            const error = new Error('El Cuit del colegio ya se encuentra registrado');
            (error as any).statusCode = 409; 
            throw error;
        }

        // 2. Verificar si el usuario existe por DNI
        const usuarioExistente = await usuario.findOne({
            where: {
                dni: altaColegio.usuario.dni,
                borrado: 0
            },
            transaction, 
        });

        if (usuarioExistente) {
            const error = new Error('El Dni ya se encuentra registrado');
            (error as any).statusCode = 409; 
            throw error;
        }

        if (altaColegio.colegio.logo) {
            altaColegio.colegio.logo = Buffer.from(
                altaColegio.colegio.logo.split(",")[1],
                "base64"
            );
        }

        // 3. Dar de alta el colegio
        const nuevoColegio = await colegio.create(altaColegio.colegio, { transaction });

         // 4. Usar el id del colegio recién creado para dar de alta el usuario
         //Encriptar contraseña
        const passEncrypt = await encriptar(altaColegio.usuario.password);
        const nuevoUsuario = await usuario.create({
            ...altaColegio.usuario,
            password:passEncrypt,
            id_rol:1, 
            id_colegio: nuevoColegio.id 
        }, { transaction });

        // 7. Retornar

        const { borrado: borradoColegio, ...responseColegio } = nuevoColegio.dataValues;
        const { password, borrado: borradoUsuario, id_rol, id_colegio, ...responseUsuario } = nuevoUsuario.dataValues;

        return { 
            colegio:{
                responseColegio
            },
            responsable:{
                responseUsuario
            }
         }; 

    } catch (error) {
        throw error;
    }
};

const suspenderColegio = async (idColegio: string, transaction:Transaction) => {
    // Inicia la transacción
    try {
        if(idColegio){
            // 1. Verificar si el colegio existe por CUIT
            const colegioExistente = await colegio.findOne({
                where: {
                    id: idColegio,
                    borrado: 0
                },
                attributes: { exclude: ['borrado'] },
                include: [{
                    model: usuario,
                    as: 'usuarios',
                    where: {
                        id_rol: 1,
                        borrado: 0
                    },
                    attributes: { exclude: ['password', 'borrado','id_rol'] },
                }],
                transaction,
            });

            if (!colegioExistente) {
                const error = new Error('No se encontro el colegio');
                (error as any).statusCode = 409; 
                throw error;
            }

            // Cambia el estado de suspensión del colegio
            colegioExistente.suspendido = colegioExistente.suspendido ? 0 : 1;

            // Guarda el cambio en la base de datos
            await colegioExistente.save({ transaction });

            return colegioExistente
        }

        const error = new Error('Se debe proporcionar el ID de colegio para Suspenderlo.');
        (error as any).statusCode = 400; 
        throw error;

    } catch (error) {
        throw error;
    }
}

const listadoColegios = async () => {
    try {
        const listado = await colegio.findAll({
            where: {
                borrado: 0
            },
            attributes: { exclude: ['borrado'] },
            include: [{
                model: usuario,
                as: 'usuarios',
                where: {
                    id_rol: 1,
                    borrado: 0
                },
                attributes: { exclude: ['password', 'borrado','id_rol'] },
            }]
        });

        // Convertir logo a base64 para cada colegio
        listado.forEach(colegio => {
            if (colegio.logo) {
                colegio.logo = Buffer.from(colegio.logo).toString('base64');
            }
        });

        return listado;
    } catch (error) {
        throw error;
    }
};

const detalleColegio = async (idColegio: string) => {
    try {
        const colegioExistente = await colegio.findOne({
            where: {
                id: idColegio,
                borrado: 0,
            },
            attributes: { exclude:['borrado']},
            include: [
                {
                    model: usuario,
                    as: 'usuarios',
                    attributes: ['id','dni','nombre','apellido','id_rol','suspendido'], 
                    required: false
                },
                {
                    model:zona_localidad,
                    as:'zona_localidad',
                    required:false,
                    attributes:{exclude:['borrado']},
                    include:[{
                        model:zona,
                        as:'zona',
                        required:false,
                        attributes:{exclude:['borrado']}
                    }]
                }
            ]
        });

        if (!colegioExistente) {
            const error = new Error('No se encontro el colegio');
            (error as any).statusCode = 409; 
            throw error;
        }

 
            if (colegioExistente.logo) {
                colegioExistente.logo = Buffer.from(colegioExistente.logo).toString('base64');
            }
     

        // Clasificar los usuarios según el id_rol
        const usuarios = colegioExistente.usuarios.reduce((acc: any, user: any) => {
            if (user.id_rol === 1) {
                acc.responsables.push(user);
            } else if (user.id_rol === 2) {
                acc.delegados.push(user);
            } else if (user.id_rol === 3) {
                acc.autorizados.push(user);
            }
            return acc;
        }, { responsables: [], delegados: [], autorizados: [] });

        const { usuarios: _, ...colegioSinUsuarios } = colegioExistente.toJSON() as any;
        // Estructura de respuesta
        return {
            colegio: colegioSinUsuarios,
            usuarios: usuarios
        };

    } catch (error) {
        throw error;
    }
};

export{obtenerColegio, suspenderColegio, listadoColegios, altaColegio,detalleColegio }
import { usuario } from "../models/usuario";
import { colegio } from "../models/colegio"
import sequelize from "../config/database";
import { encriptar } from "../utils/password.handle";
import { zona_localidad } from "../models/zona_localidad";
import { zona } from "../models/zona";
import { Transaction } from "sequelize";
import { red } from "../models/red";
import { red_colegio } from "../models/red_colegio";
import { beca_solicitud } from "../models/beca_solicitud";
import { beca } from "../models/beca";
import { BecaService } from "./matrices.service";
import { autorizados } from "../models/autorizados";
import { forma_pago } from "../models/forma_pago";
import { plan } from "../models/plan";

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
                as:'id_zona_zona_localidad',
                required:false,
                include:[{
                    model:zona,
                    as:'id_zona_zona',
                    required:false
                }]
            }]
        });

        if (!colegioEncontrado) {
            const error = new Error('No se encontro ningun colegio asociado');
            (error as any).statusCode = 409; 
            throw error;
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

        // 3. Dar de alta el colegio
        const nuevoColegio = await colegio.create(altaColegio.colegio, { transaction });

         // 4. Usar el id del colegio recién creado para dar de alta el usuario
         //Encriptar contraseña
        const passEncrypt = await encriptar(altaColegio.usuario.password);
        const nuevoUsuario = await usuario.create({
            ...altaColegio.usuario,
            password:passEncrypt,
            id_rol:1, 
            id_colegio: nuevoColegio.id,
            cambiarPass: 1
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

const editarColegio = async (editar: colegio, transaction:Transaction) => {
    
    try {
        // 1. Verificar si el colegio existe por CUIT
        const colegioExistente = await colegio.findOne({
            where: {
                id: editar.id,
                borrado: 0
            },
            transaction,
        });

  
        if (!colegioExistente) {
            const error = new Error('El colegio no existe');
            (error as any).statusCode = 409; 
            throw error;
        }

        const estadoAnterior = { ...colegioExistente.toJSON() };

        await colegio.update(editar, {
            where: { id: editar.id },
            transaction,
        });

        return {editar, estadoAnterior} 

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

const listadoColegios = async (idRol:number) => {
    try {
        const include: any[] = [
            {
              model: usuario,
              as: 'usuarios',
              where: {
                id_rol: 1,
                borrado: 0
              },
              required: false,
              attributes: { exclude: ['password', 'borrado', 'id_rol'] },
            }
          ];
      
          if (idRol == 0) {
            include.push(
              {
                model: forma_pago,
                as: 'id_forma_pago_forma_pago',
                required: false,
              },
              {
                model: plan,
                as: 'id_plan_plan',
                required: false,
              }
            );
          }
      
          const listado = await colegio.findAll({
            where: {
              borrado: 0
            },
            attributes: { exclude: ['borrado'] },
            include: include
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
            attributes: { exclude: ['borrado'] },
            include: [
                {
                    model: usuario,
                    as: 'usuarios',
                    where: { borrado: 0 },
                    attributes: ['id', 'dni', 'nombre', 'apellido', 'id_rol', 'suspendido','foto'],
                    required: false
                },
                {
                    model: zona_localidad,
                    as: 'id_zona_zona_localidad',
                    required: false,
                    attributes: { exclude: ['borrado'] },
                    include: [{
                        model: zona,
                        as: 'id_zona_zona',
                        required: false,
                        attributes: { exclude: ['borrado'] }
                    }]
                },
                {
                    model: red_colegio,  // Incluir la tabla intermedia 'red_colegio'
                    as: 'red_colegios',  // Alias para las redes
                    where: { id_colegio: idColegio, borrado: 0 },  // Filtrar por el colegio
                    include: [
                        {
                            model: red,  // Incluir el modelo de redes
                            as: 'id_red_red',  // Alias para la red
                            where:{borrado:0},
                            attributes: ['id', 'nombre', 'porcentaje', 'foto','caracteristicas'],  // Incluir datos relevantes de la red
                        }                        
                    ],
                    required:false
                },
                {
                    model:autorizados,
                    as: 'autorizados',
                    where:{borrado:0,id_colegio:idColegio},
                    required: false,
                }
            ]
        });

        if (!colegioExistente) {
            const error = new Error('No se encontró el colegio');
            (error as any).statusCode = 409;
            throw error;
        }

        // Clasificar los usuarios según el id_rol
        const usuarios = colegioExistente.usuarios.reduce((acc: any, user: any) => {
            if (user.id_rol === 1) {
                acc.responsables.push(user);
            }
            return acc;
        }, { responsables: [], delegados: [], autorizados: [] });

        
        // Extraer la información de las redes desde la tabla intermedia 'red_colegio'
        const redesRelacionadas = colegioExistente.red_colegios.map((redRel: any) => ({
            red: redRel.id_red_red,  // Obtener la red completa
            anfitrion: redRel.anfitrion  // Obtener si es anfitrión o no
        }));

        // Filtrar las redes donde el colegio es anfitrión
        const redesAnfitrion = redesRelacionadas
            .filter((rc: any) => rc.anfitrion === true)
            .map((rc: any) => rc.red);  // Extraer solo la información de la red

        // Filtrar las redes donde el colegio es solo miembro
        const redesMiembro = redesRelacionadas
            .filter((rc: any) => rc.anfitrion === false)
            .map((rc: any) => rc.red);  // Extraer solo la información de la red

        // Estructura de respuesta
        const { usuarios: _, redes: __, ...colegioSinUsuarios } = colegioExistente.toJSON() as any;
        
        return {
            colegio: colegioSinUsuarios,
            usuarios: usuarios,
            autorizados: colegioExistente.autorizados,
            anfitrion: redesAnfitrion,  // Redes donde el colegio es anfitrión
            miembro: redesMiembro     // Redes donde el colegio es solo miembro
        };

    } catch (error) {
        throw error;
    }
};

const verColegio = async (idColegio: string) => {
    try {
        const colegioExistente = await colegio.findOne({
            where: {
                id: idColegio,
                borrado: 0,
            },
            attributes: { exclude: ['borrado','suspendido'] },
            include: [
                {
                    model: usuario,
                    as: 'usuarios',
                    where: { borrado: 0 },
                    attributes: ['id', 'dni', 'nombre', 'apellido','foto','id_colegio'],
                    required: false
                },
                {
                    model: zona_localidad,
                    as: 'id_zona_zona_localidad',
                    required: false,
                    attributes: { exclude: ['borrado'] },
                    include: [{
                        model: zona,
                        as: 'id_zona_zona',
                        required: false,
                        attributes: { exclude: ['borrado'] }
                    }]
                },
                {
                    model: red_colegio,  // Incluir la tabla intermedia 'red_colegio'
                    as: 'red_colegios',  // Alias para las redes
                    where: { id_colegio: idColegio, borrado: 0 },  // Filtrar por el colegio
                    attributes: ['id_red'], 
                    include: [
                        {
                            model: red,  // Incluir el modelo de redes
                            as: 'id_red_red',  // Alias para la red
                            where:{borrado:0},
                            attributes: ['id', 'nombre', 'porcentaje', 'foto','caracteristicas'],  // Incluir datos relevantes de la red
                        }                        
                    ],
                    required:false
                }
            ]
        });

        if (!colegioExistente) {
            const error = new Error('No se encontró el colegio');
            (error as any).statusCode = 409;
            throw error;
        }

        
        // Extraer la información de las redes desde la tabla intermedia 'red_colegio'
        const redesRelacionadas = colegioExistente.red_colegios.map((redRel: any) => ({
            red: redRel.id_red_red,  // Obtener la red completa
            anfitrion: redRel.anfitrion  // Obtener si es anfitrión o no
        }));

        // Filtrar las redes donde el colegio es anfitrión
        const redesAnfitrion = redesRelacionadas
            .filter((rc: any) => rc.anfitrion === true)
            .map((rc: any) => rc.red);  // Extraer solo la información de la red

        // Filtrar las redes donde el colegio es solo miembro
        const redesMiembro = redesRelacionadas
            .filter((rc: any) => rc.anfitrion === false)
            .map((rc: any) => rc.red);  // Extraer solo la información de la red

        // Estructura de respuesta
        const { usuarios: _, redes: __, ...colegioSinUsuarios } = colegioExistente.toJSON() as any;
        
        return {
            colegio: colegioSinUsuarios,
            responsables: colegioExistente.usuarios,
            anfitrion: redesAnfitrion,  // Redes donde el colegio es anfitrión
            miembro: redesMiembro     // Redes donde el colegio es solo miembro
        };

    } catch (error) {
        throw error;
    }
};


const borrarColegio = async (idColegio: string,idUsuario:number, transaction:Transaction) => {
    try {
            const colegioExistente = await colegio.findOne({
                where: { id: idColegio, borrado: 0 },
                include: [{
                    model: usuario,
                    as: 'usuarios',
                },{
                    model:red_colegio,
                    as:'red_colegios'
                },
                {
                    model:beca,
                    as:'becas',
                    include:[{
                        model:beca_solicitud,
                        as:'beca_solicituds',
                        include:[{
                            model:colegio,
                            as:'id_colegio_solic_colegio',
                        }]
                    }]
                },{
                    model:beca_solicitud,
                    as:'beca_solicituds',
                    include:[{
                        model:beca,
                        as:'id_beca_beca'
                    }]
                }],
                transaction,
            });

            if (!colegioExistente) {
                const error = new Error('No se encontro el colegio');
                (error as any).statusCode = 409; 
                throw error;
            }

            colegioExistente.borrado = 1;
            await colegioExistente.save({ transaction });

             //Borramos sus usuarios
            let admin;
            if (colegioExistente.usuarios && colegioExistente.usuarios.length > 0) {
                for (const usuario of colegioExistente.usuarios) {
                    if(usuario.id_rol == 1)
                        admin = usuario.id

                    usuario.borrado = 1;
                    await usuario.save({ transaction });
                }
            }

            //borramos sus red_colegios (datos en sus redes)
            if (colegioExistente.red_colegios && colegioExistente.red_colegios.length > 0) {
                for (const red of colegioExistente.red_colegios) {
                    red.borrado = 1;
                    await red.save({ transaction });
                }
            }

            //Solicitudes recibidas
            if (colegioExistente.becas && colegioExistente.becas.length > 0) {
                for (const beca of colegioExistente.becas) {
                    beca.borrado = 1;
                    await beca.save({ transaction });
                    //Cambiamos las solicitudes pendiente recibidas que tengan a desestimada
                    if(beca.beca_solicituds && beca.beca_solicituds.length>0){
                        for (const solicitud of beca.beca_solicituds) {
                            if(solicitud.id_estado == 0){
                                solicitud.id_estado = 1
                                solicitud.id_resolucion = 3
                                solicitud.res_comentario = "Colegio Borrado"
                                solicitud.id_usuario_reso = admin
                                await solicitud.save({transaction})

                                await BecaService.desestimarBeca(solicitud.id_colegio_solic,idColegio,beca.id_red,transaction)
                            }
                        }
                    }
                }

               
            }

            //Solicitudes Enviadas
            if (colegioExistente.beca_solicituds && colegioExistente.beca_solicituds.length > 0) {
                for (const solicitud of colegioExistente.beca_solicituds) {
                    //Cambiamos las solicitudes pendiente recibidas que tengan a desestimada
                    if(solicitud.id_estado == 0){
                        solicitud.id_estado = 1
                        solicitud.id_resolucion = 3
                        solicitud.res_comentario = "Colegio Borrado"
                        solicitud.id_usuario_reso = admin
                        await solicitud.save({transaction})

                        await BecaService.desestimarBeca(idColegio,solicitud.id_beca_beca.id_colegio,solicitud.id_beca_beca.id_red,transaction)

                        
                    }
                }

               
            }

            return colegioExistente

    } catch (error) {
        throw error;
    }

    
}



export{obtenerColegio, suspenderColegio, listadoColegios, altaColegio,detalleColegio, borrarColegio,editarColegio,verColegio  }
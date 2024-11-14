import { colegio } from "../models/colegio"
import { Op, Transaction } from "sequelize";
import { red } from "../models/red";
import { red_colegio } from "../models/red_colegio";

interface nuevaRed{
    red:red
    colegios:[
        {
            id:number,
            anfitrion:number
        }
    ]
}

const altaRed = async (altaRed: nuevaRed, transaction:Transaction) => {
    try {

        const anfitriones = altaRed.colegios.filter(colegio => colegio.anfitrion === 1);
        if (anfitriones.length !== 1) {
            const error = new Error('Debe haber un único colegio anfitrión');
            (error as any).statusCode = 400;
            throw error;
        }
        
        // 1. Verificar si el colegio existe por CUIT
        const colegioInexistente = await colegio.findOne({
            where: {
                id: {
                    [Op.in]: altaRed.colegios.map((colegio) => colegio.id)  // Filtra por lista de IDs
                },
                borrado: 1  // Busca solo los colegios con borrado = 1
            },
            transaction: transaction
        });
        
        if (colegioInexistente) {
            const error = new Error('Algunos colegios están marcados como borrados');
            (error as any).statusCode = 409;
            throw error;
        }

        const redCreada = await red.create(altaRed.red,{transaction });

        // 3. Insertar los registros en la tabla intermedia red_colegio
        const redColegiosData = altaRed.colegios.map((colegio) => ({
            id_red: redCreada.id,  // Usamos el ID de la red recién creada
            id_colegio: colegio.id,  // Usamos el ID del colegio
            anfitrion:colegio.anfitrion
        }));

        try {
            await red_colegio.bulkCreate(redColegiosData, { transaction });
        } catch (error) {
            const errorMensaje = new Error('Error al asociar los colegios a la red');
            throw errorMensaje;
        }

        // 4. Retornar la respuesta de éxito
        return redCreada;

    } catch (error) {
        throw error;
    }
};

const listadoRedes = async () => {
    try {
        const listado = await red.findAll({
            where: {
                borrado: 0
            },
            attributes: { exclude: ['borrado'] },
            include: [
                {
                    model: red_colegio,
                    as:'red_colegios',
                    where: { anfitrion: true }, // Filtrar para incluir solo el colegio que es anfitrión
                    attributes: ['id_colegio','id_red'], // Excluir columnas de red_colegio si solo necesitas el colegio
                    include: [
                        {
                            model: colegio,
                            as:'id_colegio_colegio',
                            attributes: ['id', 'nombre', 'cuit'] 
                        }
                    ]
                }
            ]
        });
        
        const listadoMapeado = listado.map((redItem) => {    
            const anfitrion = redItem.red_colegios?.[0]?.id_colegio_colegio || null;
            const { red_colegios, ...resto } = redItem.toJSON() as any;
            
            return {
                ...resto,
                Anfitrion: anfitrion
            };
        });

        return listadoMapeado;
    } catch (error) {
        throw error;
    }
};

const borrarRed = async (idRed:string, transaction:Transaction) => {
        
    try {

        const redExistente = await red.findOne({
            where:{
                id:idRed,
                borrado:0
            }
        })

        if(!redExistente){
            const error = new Error('La red no existe');
            (error as any).statusCode = 400; 
            throw error;
        }


        // Cambiar estado de suspensión
        redExistente.borrado = 1;
        
        // Guardar cambios
        await redExistente.save({ transaction });

        // 4. Retornar
        return redExistente

    } catch (error) {
        throw error;
    }
};

// const obtenerColegio = async (idColegio:string) => {
//     try {
//         const colegioEncontrado = await colegio.findOne({
//             where: {
//                 id:idColegio,
//                 borrado: 0
//             },
//             attributes: { exclude: ['borrado'] },
//             include:[{
//                 model:zona_localidad,
//                 as:'zona_localidad',
//                 required:false,
//                 include:[{
//                     model:zona,
//                     as:'zona',
//                     required:false
//                 }]
//             }]
//         });

//         if (!colegioEncontrado) {
//             const error = new Error('No se encontro ningun colegio asociado');
//             (error as any).statusCode = 409; 
//             throw error;
//         }


//         // Convertir logo a base64 para cada colegio
//         if (colegioEncontrado && colegioEncontrado.logo) {
//             colegioEncontrado.logo = Buffer.from(colegioEncontrado.logo).toString('base64');
//         }

//         return colegioEncontrado;

//     } catch (error) {
//         throw error;
//     }
// };



// const suspenderColegio = async (idColegio: string, transaction:Transaction) => {
//     // Inicia la transacción
//     try {
//         if(idColegio){
//             // 1. Verificar si el colegio existe por CUIT
//             const colegioExistente = await colegio.findOne({
//                 where: {
//                     id: idColegio,
//                     borrado: 0
//                 },
//                 attributes: { exclude: ['borrado'] },
//                 include: [{
//                     model: usuario,
//                     as: 'usuarios',
//                     where: {
//                         id_rol: 1,
//                         borrado: 0
//                     },
//                     attributes: { exclude: ['password', 'borrado','id_rol'] },
//                 }],
//                 transaction,
//             });

//             if (!colegioExistente) {
//                 const error = new Error('No se encontro el colegio');
//                 (error as any).statusCode = 409; 
//                 throw error;
//             }

//             // Cambia el estado de suspensión del colegio
//             colegioExistente.suspendido = colegioExistente.suspendido ? 0 : 1;

//             // Guarda el cambio en la base de datos
//             await colegioExistente.save({ transaction });

//             return colegioExistente
//         }

//         const error = new Error('Se debe proporcionar el ID de colegio para Suspenderlo.');
//         (error as any).statusCode = 400; 
//         throw error;

//     } catch (error) {
//         throw error;
//     }
// }

// const listadoColegios = async () => {
//     try {
//         const listado = await colegio.findAll({
//             where: {
//                 borrado: 0
//             },
//             attributes: { exclude: ['borrado'] },
//             include: [{
//                 model: usuario,
//                 as: 'usuarios',
//                 where: {
//                     id_rol: 1,
//                     borrado: 0
//                 },
//                 attributes: { exclude: ['password', 'borrado','id_rol'] },
//             }]
//         });

//         // Convertir logo a base64 para cada colegio
//         listado.forEach(colegio => {
//             if (colegio.logo) {
//                 colegio.logo = Buffer.from(colegio.logo).toString('base64');
//             }
//         });

//         return listado;
//     } catch (error) {
//         throw error;
//     }
// };

// const detalleColegio = async (idColegio: string) => {
//     try {
//         const colegioExistente = await colegio.findOne({
//             where: {
//                 id: idColegio,
//                 borrado: 0,
//             },
//             attributes: { exclude:['borrado']},
//             include: [
//                 {
//                     model: usuario,
//                     as: 'usuarios',
//                     attributes: ['id','dni','nombre','apellido','id_rol','suspendido'], 
//                     required: false
//                 },
//                 {
//                     model:zona_localidad,
//                     as:'zona_localidad',
//                     required:false,
//                     attributes:{exclude:['borrado']},
//                     include:[{
//                         model:zona,
//                         as:'zona',
//                         required:false,
//                         attributes:{exclude:['borrado']}
//                     }]
//                 }
//             ]
//         });

//         if (!colegioExistente) {
//             const error = new Error('No se encontro el colegio');
//             (error as any).statusCode = 409; 
//             throw error;
//         }

 
//             if (colegioExistente.logo) {
//                 colegioExistente.logo = Buffer.from(colegioExistente.logo).toString('base64');
//             }
     

//         // Clasificar los usuarios según el id_rol
//         const usuarios = colegioExistente.usuarios.reduce((acc: any, user: any) => {
//             if (user.id_rol === 1) {
//                 acc.responsables.push(user);
//             } else if (user.id_rol === 2) {
//                 acc.delegados.push(user);
//             } else if (user.id_rol === 3) {
//                 acc.autorizados.push(user);
//             }
//             return acc;
//         }, { responsables: [], delegados: [], autorizados: [] });

//         const { usuarios: _, ...colegioSinUsuarios } = colegioExistente.toJSON() as any;
//         // Estructura de respuesta
//         return {
//             colegio: colegioSinUsuarios,
//             usuarios: usuarios
//         };

//     } catch (error) {
//         throw error;
//     }
// };
export{altaRed,listadoRedes,borrarRed}
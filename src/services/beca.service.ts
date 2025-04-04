
import { red_colegio } from "../models/red_colegio";
import { beca } from "../models/beca";
import { colegio } from "../models/colegio";
import { usuario } from "../models/usuario";
import { beca_solicitud } from "../models/beca_solicitud";
import { red } from "../models/red";
import { Sequelize, Op, Transaction } from "sequelize";
import { beca_resolucion } from "../models/beca_resolucion";
import { beca_estado } from "../models/beca_estado";
import { zona_localidad } from "../models/zona_localidad";
import { zona } from "../models/zona";
import { BecaService } from "./matrices.service";
import { notificaciones } from "../models/notificaciones";



interface Beca {
    cantidad:number
}

interface Solicitud {
    id_beca:number
    alumnos:[{
        nombre:string
        apellido:string
        fecha_nacimiento:string
        dni:string
        detalle:string
        id_pariente:number
    }]
}

const listadoBecas = async (idRed: string, idColegio:string,rol:number, transaction: Transaction) => {
    try {
     
        if(rol!=0){
            const redColegio = await red_colegio.findOne({
                where: {
                    id_colegio: idColegio,
                    id_red: idRed,
                    borrado: 0
                },
                transaction // Asegúrate de pasar la transacción
            });
    
            if (!redColegio) {
                const error = new Error('El colegio no pertenece a la Red');
                (error as any).statusCode = 400;
                throw error;
            }
        }


        // Verifica red_colegio
        const listado = await beca.findAll({
            where: {
                id_red: idRed,
                ...(rol == 0 ? {}:{ borrado: 0 })
            },
            attributes: ['id','cantidad', 'fecha_hora'], 
            include: [
                {
                    model: colegio,
                    as: 'id_colegio_colegio',
                    required: true,
                    attributes: { exclude: ['suspendido', 'terminos'] }
                },
                {
                    model: usuario,
                    as: 'id_usuario_usuario',
                    required: true,
                    attributes: ['nombre', 'apellido']
                },
                {
                    model: red, // Relación entre becas y red
                    as: 'id_red_red', // Alias para la relación con red
                    required: true, // Si necesitas que haya una relación
                    where: {
                        id: idRed // Asegúrate de que la beca esté relacionada con la red correcta
                    },
                    attributes: ['id'],
                    include: [
                        {
                            model: red_colegio, // Relación entre red_colegios y red
                            as: 'red_colegios', // Alias para la relación con red_colegios
                            attributes: ['bde'],
                            where: {
                                id_colegio: {
                                    [Op.eq]: Sequelize.col('beca.id_colegio') // Comparación con la columna 'id_colegio' de la tabla 'becas'
                                },
                            },
                            required:true,
                        }
                    ]
                }
            ],
            order: [
                [Sequelize.literal(`CASE WHEN id_colegio_colegio.id = '${idColegio}' THEN 0 ELSE 1 END`), 'ASC'],
                ['id_colegio', 'ASC']
            ],
            transaction // Asegúrate de pasar la transacción
        });
        
        const procesado = listado.map(item => {
            const redColegios = item.id_red_red?.red_colegios?.[0] || null; // Tomamos el primer elemento o null
            return {
                id:item.id,
                cantidad: item.cantidad,
                fecha_hora: item.fecha_hora,
                colegio: item.id_colegio_colegio?.toJSON() || {}, // Renombramos a "colegio"
                usuario: item.id_usuario_usuario?.toJSON() || {}, // Renombramos a "usuario"
                disponible: redColegios?.bde || 0 // Extraemos "bde" como "disponible"
            };
        });

        return procesado;
    } catch (error) {
        throw error;
    }
};

const altaBeca = async (altaBeca: Beca, idUsuario: string, idColegio: string, idRed: string, transaction: Transaction) => {
    try {
        const redColegio = await red_colegio.findOne({
            where: { 
                id_colegio: idColegio, 
                id_red: idRed, 
                borrado: 0 },
            transaction
        });

        if (!redColegio) {
            const error = new Error('El colegio no pertenece a la Red');
            (error as any).statusCode = 400;
            throw error;
        }

        const becasUsadas = redColegio.dbu || 0;
        if (altaBeca.cantidad < becasUsadas) {
            const error = new Error('No se pueden ofrecer menos becas que las que se tienen tomadas y pendientes');
            (error as any).statusCode = 400;
            throw error;
        }

        // Verifica si existe la beca
        const becaActualizar = await beca.findOne({
            where: { id_red: redColegio.id_red, id_colegio: redColegio.id_colegio, borrado: 0 },
            transaction
        });

        if (!becaActualizar) {
            // Crear nueva beca
            const nuevaBeca = await beca.create(
                {
                    id_red: Number(idRed),
                    id_colegio: Number(idColegio),
                    id_usuario: Number(idUsuario),
                    cantidad: altaBeca.cantidad
                },
                { transaction }
            );

            // 🔥 Usamos el servicio para actualizar matrices
            await BecaService.altaBeca(idColegio,idRed, altaBeca.cantidad, transaction);
            return nuevaBeca;
        }

        // Actualizar beca existente
        becaActualizar.cantidad = altaBeca.cantidad;
        becaActualizar.fecha_hora = new Date();
        await becaActualizar.save({ transaction });

        // 🔥 Usamos el servicio para actualizar matrices
        await BecaService.altaBeca(idColegio,idRed, altaBeca.cantidad, transaction);
        
        return becaActualizar;
    } catch (error) {
        throw error;
    }
};

const solicitarBeca = async (solicitud: Solicitud, idRed: string, idUsuario: string, idColegio: string, transaction: Transaction) => {
    try {
        // Verifica que el colegio solicitante pertenece a la red
        const redColegioSolicitante = await red_colegio.findOne({
            where: { id_colegio: idColegio, id_red: idRed, borrado: 0 },
            include:[{
                model:colegio,
                as:'id_colegio_colegio'
            }],
            transaction
        });

        if (!redColegioSolicitante) {
            const error = new Error('El colegio no pertenece a la Red');
            (error as any).statusCode = 400;
            throw error;
        }

        // Verifica que la beca solicitada existe
        const becaSolicitada = await beca.findOne({
            where: { 
                id: solicitud.id_beca,
                borrado:0
             },
            include:[{
                model:colegio,
                as:'id_colegio_colegio'
            }],
            transaction
        });

        if (!becaSolicitada) {
            const error = new Error('La Beca no existe');
            (error as any).statusCode = 400;
            throw error;
        }

        // Verifica que el colegio receptor pertenece a la red
        const redColegioReceptor = await red_colegio.findOne({
            where: { id_red: idRed, id_colegio: becaSolicitada.id_colegio, borrado: 0 },
            transaction
        });

        if (!redColegioReceptor) {
            const error = new Error('El colegio al que se solicita no pertenece a la Red');
            (error as any).statusCode = 400;
            throw error;
        }

        // Verifica si el colegio receptor sigue aceptando solicitudes
        if ((redColegioReceptor.bde || 0) <= 0) {
            const error = new Error('El colegio ya no recibe solicitudes para la beca');
            (error as any).statusCode = 400;
            throw error;
        }

        // Crear las solicitudes para cada alumno
        const solicitudes = solicitud.alumnos.map(alumno => ({
            id_beca: solicitud.id_beca,
            id_resolucion: 0,
            id_colegio_solic: Number(idColegio),
            id_usuario_solic: Number(idUsuario),
            alumno_nombre: alumno.nombre,
            alumno_apellido: alumno.apellido,
            alumno_fecha: alumno.fecha_nacimiento,
            alumno_dni: alumno.dni,
            detalle: alumno.detalle,
            id_pariente: alumno.id_pariente ? alumno.id_pariente : Number(idUsuario)
        }));

        // Inserta todas las solicitudes de una sola vez y devuelve las creadas
        const solicitudesCreadas = await beca_solicitud.bulkCreate(solicitudes, { transaction, returning: true });

        // Usa BecaService para actualizar las matrices
        await BecaService.solicitarBeca(Number(idColegio), becaSolicitada.id_colegio, solicitudes.length, Number(idRed), transaction);

        // Crear notificaciones en una sola operación con bulkCreate
        const notificacionesData = solicitudesCreadas.map(sol => ({
            id_solicitud: sol.id,
            id_colegio_ofer: becaSolicitada.id_colegio, // Asegurar que la relación es válida
            id_colegio_solic: sol.id_colegio_solic,
            leido_solic:1
        }));

        await notificaciones.bulkCreate(notificacionesData, { transaction });
        
        return { 
            solicitudesCreadas, 
            emailDestino: becaSolicitada.id_colegio_colegio.email, 
            cantidad: solicitudes.length,
            colegioSolicitante: redColegioSolicitante.id_colegio_colegio.nombre 
        };
    } catch (error) {
        throw error;
    }
};


//SOLICITUDES QUE RECIBO
const listadoSolicitudes = async (idRed: string, idColegio: string, idEstado: number, idRol: number, transaction: Transaction) => {
    try {
        let includeBeca = [{
            model: beca,
            as: 'id_beca_beca',
            where: {
                id_red: idRed,
                ...(idRol !== 0 && { id_colegio: idColegio })
            },
            required: true,
            // Aquí agregamos el include de 'colegio' si el rol es administrador
            include: idRol === 0 ? [{
                model: colegio,
                as: 'id_colegio_colegio',
                attributes: ['nombre'],
                required: true
            }] : [] // Si no es administrador, no incluye el colegio solicitado
        }];

        const listado = await beca_solicitud.findAll({
            where: idEstado >= 0 ? { id_estado: idEstado } : {},
            include: [
                ...includeBeca,
                {
                    model: usuario,
                    as: 'id_usuario_solic_usuario',
                    attributes: ['nombre', 'apellido'],
                    required: true,
                },
                {
                    model: colegio,
                    as: 'id_colegio_solic_colegio',
                    attributes: ['nombre'],
                    required: true,
                },
                {
                    model: beca_estado,
                    as: 'id_estado_beca_estado',
                    required: true
                }
            ],
            transaction // Asegúrate de pasar la transacción
        });

        const procesado = listado.map(item => {
            return {
                id: item.id,
                fecha: item.fecha_hora,
                sinLeer: item.sinLeer,
                estado: {
                    id: item.id_estado,
                    nombre: item.id_estado_beca_estado.nombre
                },
                solicitante: {
                    colegio: item.id_colegio_solic_colegio.nombre,
                    usuario: item.id_usuario_solic_usuario.apellido + ', ' + item.id_usuario_solic_usuario.nombre,
                    alumno: item.alumno_apellido + ', ' + item.alumno_nombre
                },
                // Agregar colegio solicitado si es administrador
                colegioSolicitado: idRol === 0 ? item.id_beca_beca.id_colegio_colegio.nombre : null
            };
        });
        
        return procesado;
    } catch (error) {
        throw error;
    }
};


const solicitudDetalle = async (idSolicitud:string, idRed: string, idColegio:string, idRol:number, transaction: Transaction) => {
    try {
        
        const solicitud = await beca_solicitud.findOne({
            where: {
                id:idSolicitud,
            },
            include:[{
                model:beca,
                as:'id_beca_beca',
                where:{
                    ...(idRol!=0 ? { id_colegio: idColegio } : {}),
                    id_red:idRed
                },
                include:[{
                    model:colegio,
                    as:'id_colegio_colegio',
                    attributes:{exclude:['terminos','suspendido','borrado']},
                }],
                required:true
            },
            {
                model:colegio,
                as:'id_colegio_solic_colegio',
                attributes:{exclude:['terminos','suspendido','borrado']},
                include:[{
                    model:zona_localidad,
                    as:'id_zona_zona_localidad',
                    attributes:['nombre','id','id_zona'],
                    required:false,
                    include:[{
                        model:zona,
                        as:'id_zona_zona',
                        attributes:['nombre','id'],
                        required:false,
                    }]
                }],
                required:true
            },{
                model:usuario,
                as:'id_usuario_solic_usuario',
                attributes:['nombre','apellido','telefono','celular','email','foto'],
                required:true,
            },{
                model:beca_resolucion,
                as:'id_resolucion_beca_resolucion',
                required:true
            },{
                model:usuario,
                as:'id_usuario_reso_usuario',
                attributes:['nombre','apellido','telefono','celular','email','foto'],
                required:false
            },
            {
                model:beca_estado,
                as:'id_estado_beca_estado',
                required:true
            },
            {
                model:usuario,
                as:'id_usuario_baja_usuario',
                attributes:['nombre','apellido','telefono','celular','email','foto'],
                required:false
            },
            {
                model:notificaciones,
                as:'notificaciones',
                required:false
            }],
            transaction // Asegúrate de pasar la transacción
        });

        if (!solicitud) {
            const error = new Error('No se encontro la solicitud');
            (error as any).statusCode = 400;
            throw error;
        }

        if (solicitud.notificaciones && solicitud.notificaciones.length > 0 && idRol !== 0) {
            const ids = solicitud.notificaciones.map(n => n.id); 
          
            await notificaciones.update(
              { leido_ofer: 1 },
              { where: { id: ids } }
            );
          }

        const procesado = {
                id:solicitud?.id,
                detalle:solicitud?.detalle,
                fecha:solicitud?.fecha_hora,
                sinLeer:solicitud.sinLeer,
                estado:{
                    id:solicitud?.id_estado,
                    nombre:solicitud?.id_estado_beca_estado.nombre
                },
                resolucion:{
                    id:solicitud?.id_resolucion,
                    nombre:solicitud?.id_resolucion_beca_resolucion.nombre,
                    conResolucion: solicitud?.id_resolucion > 0 && solicitud.id_estado != 4,
                    detalle:{
                        usuario:solicitud?.id_usuario_reso_usuario,
                        fecha:solicitud?.reso_fecha_hora,
                        comentario:solicitud?.res_comentario
                    }
                },
                solicitante:{
                    colegio:solicitud?.id_colegio_solic_colegio,
                    usuario:solicitud?.id_usuario_solic_usuario
                },
                alumno:{
                    nombre:solicitud?.alumno_nombre,
                    apellido:solicitud?.alumno_apellido,
                    dni:solicitud?.alumno_dni,
                    nacimiento:solicitud?.alumno_fecha,
                },
                solicitado:{
                    colegio:idRol === 0 ? solicitud.id_beca_beca.id_colegio_colegio : null,
                }, 
                baja:solicitud?.id_estado == 3,
                ...(solicitud?.id_estado === 3 && { detalle_baja: {
                    usuario:solicitud.id_usuario_baja_usuario,
                    fecha:solicitud.baja_fecha_hora,
                    comentario:solicitud.baja_comentario
                }})
            };       

        return procesado;
    } catch (error) {
        throw error;
    }
};

//SOLICITUDES QUE YO ENVIE
const misSolicitudes = async (
    idRed: string, 
    idColegio: string, 
    idRol: string, 
    idUsuario: string, 
    idEstado: number,
    transaction: Transaction
) => {
    try {
        // Define la condición inicial de la consulta
        const whereCondition: any = {
            id_colegio_solic: idColegio,
            ...(idEstado >= 0 && { id_estado: idEstado })
        };

        // Agregar filtro por usuario si el idRol es mayor a 2
        if (parseInt(idRol) > 2) {
            whereCondition.id_usuario_solic = idUsuario;
        }

        const listado = await beca_solicitud.findAll({
            where: whereCondition,
            include: [
                {
                    model: beca,
                    as: 'id_beca_beca',
                    where: {
                        id_red: idRed,
                    },
                    required: true,
                    include:[{
                        model:colegio,
                        as:'id_colegio_colegio',
                        required:true
                    }]
                },
                {
                    model: usuario,
                    as: 'id_usuario_solic_usuario',
                    attributes: ['nombre', 'apellido'],
                    required: true,
                },
                {
                    model: beca_estado,
                    as: 'id_estado_beca_estado',
                    required: true,
                }
            ],
            transaction, // Asegúrate de pasar la transacción
        });
        
        

        const procesado = listado.map(item => {
            return {
                id: item.id,
                fecha: item.fecha_hora,
                sinLeer: item.sinLeerSolicitante,
                estado: {
                    id: item.id_estado,
                    nombre: item.id_estado_beca_estado.nombre,
                },
                solicitante: {
                    usuario: item.id_usuario_solic_usuario.apellido + ', ' + item.id_usuario_solic_usuario.nombre,
                },
                solicitud:{
                    colegio: item.id_beca_beca.id_colegio_colegio.nombre,
                    alumno:item.alumno_apellido+', '+item.alumno_nombre
                }
            };
        });

        return procesado;
    } catch (error) {
        throw error;
    }
};

const miSolicitudDetalle = async (
    idSolicitud: string,
    idRed: string,
    idColegio: string,
    idRol: string,
    idUsuario: string,
    transaction: Transaction
) => {
    try {
        // Construye las condiciones iniciales
        const whereCondition: any = {
            id: idSolicitud,
        };

        // Agrega la condición adicional para roles > 2
        if (parseInt(idRol) > 2) {
            whereCondition.id_usuario_solic = idUsuario;
        }

        const solicitud = await beca_solicitud.findOne({
            where: whereCondition,
            include: [
                {
                    model: beca,
                    as: 'id_beca_beca',
                    where: {
                        id_red: idRed,
                    },
                    required: true,
                    include:[{
                        model:colegio,
                        as:'id_colegio_colegio',
                        required: true,
                    }]
                },
                {
                    model: colegio,
                    as: 'id_colegio_solic_colegio',
                    attributes: { exclude: ['terminos', 'suspendido', 'borrado'] },
                    include: [
                        {
                            model: zona_localidad,
                            as: 'id_zona_zona_localidad',
                            attributes: ['nombre', 'id', 'id_zona'],
                            required: false,
                            include: [
                                {
                                    model: zona,
                                    as: 'id_zona_zona',
                                    attributes: ['nombre', 'id'],
                                    required: false,
                                },
                            ],
                        },
                    ],
                    required: true,
                },
                {
                    model: usuario,
                    as: 'id_usuario_solic_usuario',
                    attributes: ['nombre', 'apellido', 'telefono', 'celular', 'email', 'foto'],
                    required: true,
                },
                {
                    model: beca_resolucion,
                    as: 'id_resolucion_beca_resolucion',
                    required: true,
                },
                {
                    model: usuario,
                    as: 'id_usuario_reso_usuario',
                    attributes: ['nombre', 'apellido', 'telefono', 'celular', 'email', 'foto'],
                    required: false,
                },
                {
                    model: beca_estado,
                    as: 'id_estado_beca_estado',
                    required: true,
                },
                {
                    model: usuario,
                    as: 'id_usuario_baja_usuario',
                    attributes: ['nombre', 'apellido', 'telefono', 'celular', 'email', 'foto'],
                    required: false,
                },
                {
                    model:usuario,
                    as:'id_pariente_usuario',
                    attributes: ['nombre', 'apellido'],
                    required:true
                },
                {
                    model:notificaciones,
                    as:'notificaciones',
                    required:false
                }
            ],
            transaction,
        });

        if (!solicitud) {
            const error = new Error('No se encontró la solicitud');
            (error as any).statusCode = 400;
            throw error;
        }

        if (solicitud.notificaciones && solicitud.notificaciones.length > 0) {
            const ids = solicitud.notificaciones.map(n => n.id); 
          
            await notificaciones.update(
              { leido_solic: 1 },
              { where: { id: ids } }
            );
          }

        const procesado = {
            id: solicitud?.id,
            detalle: solicitud?.detalle,
            fecha: solicitud?.fecha_hora,
            sinLeer: solicitud?.sinLeerSolicitante,
            estado: {
                id: solicitud?.id_estado,
                nombre: solicitud?.id_estado_beca_estado.nombre,
            },
            resolucion: {
                id: solicitud?.id_resolucion,
                nombre: solicitud?.id_resolucion_beca_resolucion.nombre,
                conResolucion: solicitud?.id_resolucion > 0 && solicitud.id_estado != 4,
                detalle:{
                        usuario:solicitud?.id_usuario_reso_usuario,
                        fecha:solicitud?.reso_fecha_hora,
                        comentario:solicitud?.res_comentario
                }
            },
            solicitante: {
                usuario: solicitud?.id_usuario_solic_usuario,
                pariente: solicitud?.id_pariente_usuario.apellido+', '+solicitud?.id_pariente_usuario.nombre,
            },
            solicitud:{
                colegio: solicitud?.id_beca_beca.id_colegio_colegio
            },
            alumno: {
                nombre: solicitud?.alumno_nombre,
                apellido: solicitud?.alumno_apellido,
                dni: solicitud?.alumno_dni,
                nacimiento: solicitud?.alumno_fecha,
            },
            baja:solicitud?.id_estado == 3,
                ...(solicitud?.id_estado === 3 && { detalle_baja: {
                    usuario:solicitud.id_usuario_baja_usuario,
                    fecha:solicitud.baja_fecha_hora,
                    comentario:solicitud.baja_comentario
                }
            })
        };

        return procesado;
    } catch (error) {
        throw error;
    }
};



const resolverSolicitud = async (
    resolver: { id_solicitud: string; id_resolucion: number; res_comentario: string },
    idRed: string,
    idUsuario: string,
    idColegio: string,
    transaction: Transaction
) => {
    try {
        const estadoAprobada = 5;
        const estadoRechazada = 2;

        // Verifica que la beca solicitada existe
        const solicitud = await beca_solicitud.findOne({
            where: { id: resolver.id_solicitud },
            include: [
                {
                    model: beca,
                    as: 'id_beca_beca',
                    where: { 
                        id_colegio: idColegio, 
                        id_red: idRed,
                        borrado:0 
                    },
                    required: true,
                    include:[{
                        model:colegio,
                        as:'id_colegio_colegio'
                    }]
                },
                {
                    model:colegio,
                    as:'id_colegio_solic_colegio'
                }
            ],
            transaction,
        });

        if (!solicitud) {
            const error = new Error('La Solicitud no existe');
            (error as any).statusCode = 400;
            throw error;
        }


        if (resolver.id_resolucion === 1) {
            const fecha = new Date()
            // Resolución aprobada
            await solicitud.update(
                {
                    sinLeerSolicitante:1,
                    id_estado: estadoAprobada,
                    id_resolucion: resolver.id_resolucion,
                    id_usuario_reso: Number(idUsuario),
                    reso_fecha_hora:fecha,
                    res_comentario: resolver.res_comentario,
                    
                },
                { transaction }
            );
            await BecaService.aprobarBeca(idColegio,idRed,transaction)

        } else if (resolver.id_resolucion === 2) {
            const fecha = new Date()
            // Resolución rechazada
            await solicitud.update(
                {
                    id_estado: estadoRechazada,
                    id_resolucion: resolver.id_resolucion,
                    id_usuario_reso: Number(idUsuario),
                    reso_fecha_hora:fecha,
                    res_comentario: resolver.res_comentario,
                    sinLeerSolicitante:1
                },
                { transaction }
            );

            await BecaService.rechazarBeca(solicitud.id_colegio_solic,idColegio,idRed,transaction)
        }

        await notificaciones.update(
            {
                leido_solic:0,
                resuelta:1,
            },
            {
              where: {
                id_solicitud: solicitud.id,
              },
              transaction
            }
          );


        return {solicitud,emailDestino:solicitud.id_colegio_solic_colegio.email,colegioSolicitud:solicitud.id_beca_beca.id_colegio_colegio.nombre};
    } catch (error) {
        throw error;
    }
};

const desestimarSolicitud = async (
    desestimar: { id_solicitud: string; res_comentario: string },
    idRed: string,
    idUsuario: string,
    idColegio: string,
    idRol: string,
    transaction: Transaction
) => {
    try {

        const whereCondition: any = {
            id: desestimar.id_solicitud,
        };

        // Agregar filtro por usuario si el idRol es mayor a 2
        if (parseInt(idRol) > 2) {
            whereCondition.id_usuario_solic = idUsuario;
        }

        // Verifica que la beca solicitada existe
        const solicitud = await beca_solicitud.findOne({
            where: whereCondition,
            include: [
                {
                    model: beca,
                    as: 'id_beca_beca',
                    where: { id_red: idRed },
                    include:[
                        {
                            model:colegio,
                            as:'id_colegio_colegio'
                        }],
                    required: true,
                },
                {
                    model:colegio,
                    as:'id_colegio_solic_colegio'
                }
            ],
            transaction,
        });

        if (!solicitud) {
            const error = new Error('La Solicitud no existe');
            (error as any).statusCode = 400;
            throw error;
        }


            const fecha = new Date()
            // Resolución aprobada
            await solicitud.update(
                {
                    id_estado: 1,
                    id_resolucion: 3,
                    id_usuario_reso: Number(idUsuario),
                    reso_fecha_hora:fecha,
                    res_comentario: desestimar.res_comentario,
                    sinLeer:1
                },
                { transaction }
            );

            await BecaService.desestimarBeca(idColegio,solicitud.id_beca_beca.id_colegio,idRed,transaction)

            await notificaciones.update(
                {
                  leido_ofer: 0,
                  desestimada: 1,
                },
                {
                  where: {
                    id_solicitud: solicitud.id,
                  },
                  transaction
                }
              );

            return {solicitud,emailDestino:solicitud.id_beca_beca.id_colegio_colegio.email,colegioSolicitante:solicitud.id_colegio_solic_colegio.nombre};
   
       } catch (error) {
        throw error;
    }
};

const darBajaSolicitud = async (
    desestimar: { id_solicitud: string; baja_comentario: string },
    idRed: string,
    idUsuario: string,
    idColegio: string,
    idRol: string,
    transaction: Transaction
) => {
    try {
        if (parseInt(idRol) > 2) {
            const error = new Error('No puede dar de baja una Beca');
            (error as any).statusCode = 400;
            throw error;
        }

        const solicitud = await beca_solicitud.findOne({
            where: { id: desestimar.id_solicitud },
            include: [
                {
                    model: beca,
                    as: 'id_beca_beca',
                    where: { id_red: idRed },
                    include: [
                        {
                            model: colegio,
                            as: 'id_colegio_colegio'
                        }
                    ],
                    required: true,
                },
                {
                    model: colegio,
                    as: 'id_colegio_solic_colegio'
                }
            ],
            transaction,
        });

        if (!solicitud) {
            const error = new Error('La Solicitud no existe');
            (error as any).statusCode = 400;
            throw error;
        }

        const fecha = new Date();
        await solicitud.update(
            {
                id_estado: 3,
                baja_fecha_hora: fecha,
                id_usuario_baja: Number(idUsuario),
                baja_comentario: desestimar.baja_comentario,
                sinLeerSolicitante: 1
            },
            { transaction }
        );

        await notificaciones.update(
            {
                leido_solic:0,
                porbaja:1,
            },
            {
              where: {
                id_solicitud: solicitud.id,
              },
              transaction
            }
          );


        // Determinar quién solicita y quién debe ser informado
        const colegioSolicitante = solicitud.id_colegio_solic_colegio;
        const colegioOfertante = solicitud.id_beca_beca.id_colegio_colegio;

        const colegioQueSolicito =
            Number(idColegio) === colegioSolicitante.id
                ? colegioSolicitante
                : colegioOfertante;

        const colegioAInformar =
            Number(idColegio) === colegioSolicitante.id
                ? colegioOfertante
                : colegioSolicitante;

        return {
            solicitud,
            colegioQueSolicito: {
                nombre: colegioQueSolicito.nombre,
                email: colegioQueSolicito.email,
            },
            colegioAInformar: {
                nombre: colegioAInformar.nombre,
                email: colegioAInformar.email,
            }
        };
    } catch (error) {
        throw error;
    }
};




export{altaBeca,listadoBecas,solicitarBeca,listadoSolicitudes,solicitudDetalle,misSolicitudes,miSolicitudDetalle,resolverSolicitud,desestimarSolicitud,darBajaSolicitud }
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.darBajaSolicitud = exports.desestimarSolicitud = exports.resolverSolicitud = exports.miSolicitudDetalle = exports.misSolicitudes = exports.solicitudDetalle = exports.listadoSolicitudes = exports.solicitarBeca = exports.listadoBecas = exports.altaBeca = void 0;
const red_colegio_1 = require("../models/red_colegio");
const beca_1 = require("../models/beca");
const colegio_1 = require("../models/colegio");
const usuario_1 = require("../models/usuario");
const beca_solicitud_1 = require("../models/beca_solicitud");
const red_1 = require("../models/red");
const sequelize_1 = require("sequelize");
const beca_resolucion_1 = require("../models/beca_resolucion");
const beca_estado_1 = require("../models/beca_estado");
const zona_localidad_1 = require("../models/zona_localidad");
const zona_1 = require("../models/zona");
const matrices_service_1 = require("./matrices.service");
const listadoBecas = async (idRed, idColegio, rol, transaction) => {
    try {
        if (rol != 0) {
            const redColegio = await red_colegio_1.red_colegio.findOne({
                where: {
                    id_colegio: idColegio,
                    id_red: idRed,
                    borrado: 0
                },
                transaction // Asegúrate de pasar la transacción
            });
            if (!redColegio) {
                const error = new Error('El colegio no pertenece a la Red');
                error.statusCode = 400;
                throw error;
            }
        }
        // Verifica red_colegio
        const listado = await beca_1.beca.findAll({
            where: {
                id_red: idRed,
                ...(rol == 0 ? {} : { borrado: 0 })
            },
            attributes: ['id', 'cantidad', 'fecha_hora'],
            include: [
                {
                    model: colegio_1.colegio,
                    as: 'id_colegio_colegio',
                    required: true,
                    attributes: { exclude: ['suspendido', 'terminos'] }
                },
                {
                    model: usuario_1.usuario,
                    as: 'id_usuario_usuario',
                    required: true,
                    attributes: ['nombre', 'apellido']
                },
                {
                    model: red_1.red, // Relación entre becas y red
                    as: 'id_red_red', // Alias para la relación con red
                    required: true, // Si necesitas que haya una relación
                    where: {
                        id: idRed // Asegúrate de que la beca esté relacionada con la red correcta
                    },
                    attributes: ['id'],
                    include: [
                        {
                            model: red_colegio_1.red_colegio, // Relación entre red_colegios y red
                            as: 'red_colegios', // Alias para la relación con red_colegios
                            attributes: ['bde'],
                            where: {
                                id_colegio: {
                                    [sequelize_1.Op.eq]: sequelize_1.Sequelize.col('beca.id_colegio') // Comparación con la columna 'id_colegio' de la tabla 'becas'
                                },
                            },
                            required: true,
                        }
                    ]
                }
            ],
            order: [
                [sequelize_1.Sequelize.literal(`CASE WHEN id_colegio_colegio.id = '${idColegio}' THEN 0 ELSE 1 END`), 'ASC'],
                ['id_colegio', 'ASC']
            ],
            transaction // Asegúrate de pasar la transacción
        });
        const procesado = listado.map(item => {
            const redColegios = item.id_red_red?.red_colegios?.[0] || null; // Tomamos el primer elemento o null
            return {
                id: item.id,
                cantidad: item.cantidad,
                fecha_hora: item.fecha_hora,
                colegio: item.id_colegio_colegio?.toJSON() || {}, // Renombramos a "colegio"
                usuario: item.id_usuario_usuario?.toJSON() || {}, // Renombramos a "usuario"
                disponible: redColegios?.bde || 0 // Extraemos "bde" como "disponible"
            };
        });
        return procesado;
    }
    catch (error) {
        throw error;
    }
};
exports.listadoBecas = listadoBecas;
const altaBeca = async (altaBeca, idUsuario, idColegio, idRed, transaction) => {
    try {
        const redColegio = await red_colegio_1.red_colegio.findOne({
            where: {
                id_colegio: idColegio,
                id_red: idRed,
                borrado: 0
            },
            transaction
        });
        if (!redColegio) {
            const error = new Error('El colegio no pertenece a la Red');
            error.statusCode = 400;
            throw error;
        }
        const becasUsadas = redColegio.dbu || 0;
        if (altaBeca.cantidad < becasUsadas) {
            const error = new Error('No se pueden ofrecer menos becas que las que se tienen tomadas y pendientes');
            error.statusCode = 400;
            throw error;
        }
        // Verifica si existe la beca
        const becaActualizar = await beca_1.beca.findOne({
            where: { id_red: redColegio.id_red, id_colegio: redColegio.id_colegio, borrado: 0 },
            transaction
        });
        if (!becaActualizar) {
            // Crear nueva beca
            const nuevaBeca = await beca_1.beca.create({
                id_red: Number(idRed),
                id_colegio: Number(idColegio),
                id_usuario: Number(idUsuario),
                cantidad: altaBeca.cantidad
            }, { transaction });
            // 🔥 Usamos el servicio para actualizar matrices
            await matrices_service_1.BecaService.altaBeca(idColegio, idRed, altaBeca.cantidad, transaction);
            return nuevaBeca;
        }
        // Actualizar beca existente
        becaActualizar.cantidad = altaBeca.cantidad;
        becaActualizar.fecha_hora = new Date();
        await becaActualizar.save({ transaction });
        // 🔥 Usamos el servicio para actualizar matrices
        await matrices_service_1.BecaService.altaBeca(idColegio, idRed, altaBeca.cantidad, transaction);
        return becaActualizar;
    }
    catch (error) {
        throw error;
    }
};
exports.altaBeca = altaBeca;
const solicitarBeca = async (solicitud, idRed, idUsuario, idColegio, transaction) => {
    try {
        // Verifica que el colegio solicitante pertenece a la red
        const redColegioSolicitante = await red_colegio_1.red_colegio.findOne({
            where: { id_colegio: idColegio, id_red: idRed, borrado: 0 },
            include: [{
                    model: colegio_1.colegio,
                    as: 'id_colegio_colegio'
                }],
            transaction
        });
        if (!redColegioSolicitante) {
            const error = new Error('El colegio no pertenece a la Red');
            error.statusCode = 400;
            throw error;
        }
        // Verifica que la beca solicitada existe
        const becaSolicitada = await beca_1.beca.findOne({
            where: {
                id: solicitud.id_beca,
                borrado: 0
            },
            include: [{
                    model: colegio_1.colegio,
                    as: 'id_colegio_colegio'
                }],
            transaction
        });
        if (!becaSolicitada) {
            const error = new Error('La Beca no existe');
            error.statusCode = 400;
            throw error;
        }
        // Verifica que el colegio receptor pertenece a la red
        const redColegioReceptor = await red_colegio_1.red_colegio.findOne({
            where: { id_red: idRed, id_colegio: becaSolicitada.id_colegio, borrado: 0 },
            transaction
        });
        if (!redColegioReceptor) {
            const error = new Error('El colegio al que se solicita no pertenece a la Red');
            error.statusCode = 400;
            throw error;
        }
        // Verifica si el colegio receptor sigue aceptando solicitudes
        if ((redColegioReceptor.bde || 0) <= 0) {
            const error = new Error('El colegio ya no recibe solicitudes para la beca');
            error.statusCode = 400;
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
        const solicitudesCreadas = await beca_solicitud_1.beca_solicitud.bulkCreate(solicitudes, { transaction, returning: true });
        // Usa BecaService para actualizar las matrices
        await matrices_service_1.BecaService.solicitarBeca(Number(idColegio), becaSolicitada.id_colegio, solicitudes.length, Number(idRed), transaction);
        return {
            solicitudesCreadas,
            emailDestino: becaSolicitada.id_colegio_colegio.email,
            cantidad: solicitudes.length,
            colegioSolicitante: redColegioSolicitante.id_colegio_colegio.nombre
        };
    }
    catch (error) {
        throw error;
    }
};
exports.solicitarBeca = solicitarBeca;
//SOLICITUDES QUE RECIBO
const listadoSolicitudes = async (idRed, idColegio, idEstado, idRol, transaction) => {
    try {
        let includeBeca = [{
                model: beca_1.beca,
                as: 'id_beca_beca',
                where: {
                    id_red: idRed,
                    ...(idRol !== 0 && { id_colegio: idColegio })
                },
                required: true,
                // Aquí agregamos el include de 'colegio' si el rol es administrador
                include: idRol === 0 ? [{
                        model: colegio_1.colegio,
                        as: 'id_colegio_colegio',
                        attributes: ['nombre'],
                        required: true
                    }] : [] // Si no es administrador, no incluye el colegio solicitado
            }];
        const listado = await beca_solicitud_1.beca_solicitud.findAll({
            where: idEstado >= 0 ? { id_estado: idEstado } : {},
            include: [
                ...includeBeca,
                {
                    model: usuario_1.usuario,
                    as: 'id_usuario_solic_usuario',
                    attributes: ['nombre', 'apellido'],
                    required: true,
                },
                {
                    model: colegio_1.colegio,
                    as: 'id_colegio_solic_colegio',
                    attributes: ['nombre'],
                    required: true,
                },
                {
                    model: beca_estado_1.beca_estado,
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
    }
    catch (error) {
        throw error;
    }
};
exports.listadoSolicitudes = listadoSolicitudes;
const solicitudDetalle = async (idSolicitud, idRed, idColegio, idRol, transaction) => {
    try {
        const solicitud = await beca_solicitud_1.beca_solicitud.findOne({
            where: {
                id: idSolicitud,
            },
            include: [{
                    model: beca_1.beca,
                    as: 'id_beca_beca',
                    where: {
                        ...(idRol != 0 ? { id_colegio: idColegio } : {}),
                        id_red: idRed
                    },
                    include: [{
                            model: colegio_1.colegio,
                            as: 'id_colegio_colegio',
                            attributes: { exclude: ['terminos', 'suspendido', 'borrado'] },
                        }],
                    required: true
                },
                {
                    model: colegio_1.colegio,
                    as: 'id_colegio_solic_colegio',
                    attributes: { exclude: ['terminos', 'suspendido', 'borrado'] },
                    include: [{
                            model: zona_localidad_1.zona_localidad,
                            as: 'id_zona_zona_localidad',
                            attributes: ['nombre', 'id', 'id_zona'],
                            required: false,
                            include: [{
                                    model: zona_1.zona,
                                    as: 'id_zona_zona',
                                    attributes: ['nombre', 'id'],
                                    required: false,
                                }]
                        }],
                    required: true
                }, {
                    model: usuario_1.usuario,
                    as: 'id_usuario_solic_usuario',
                    attributes: ['nombre', 'apellido', 'telefono', 'celular', 'email', 'foto'],
                    required: true,
                }, {
                    model: beca_resolucion_1.beca_resolucion,
                    as: 'id_resolucion_beca_resolucion',
                    required: true
                }, {
                    model: usuario_1.usuario,
                    as: 'id_usuario_reso_usuario',
                    attributes: ['nombre', 'apellido', 'telefono', 'celular', 'email', 'foto'],
                    required: false
                },
                {
                    model: beca_estado_1.beca_estado,
                    as: 'id_estado_beca_estado',
                    required: true
                },
                {
                    model: usuario_1.usuario,
                    as: 'id_usuario_baja_usuario',
                    attributes: ['nombre', 'apellido', 'telefono', 'celular', 'email', 'foto'],
                    required: false
                }],
            transaction // Asegúrate de pasar la transacción
        });
        if (!solicitud) {
            const error = new Error('No se encontro la solicitud');
            error.statusCode = 400;
            throw error;
        }
        if (solicitud.sinLeer == 1 && idRol != 0) {
            solicitud.sinLeer = 0;
            await solicitud.save({ transaction });
        }
        const procesado = {
            id: solicitud?.id,
            detalle: solicitud?.detalle,
            fecha: solicitud?.fecha_hora,
            sinLeer: solicitud.sinLeer,
            estado: {
                id: solicitud?.id_estado,
                nombre: solicitud?.id_estado_beca_estado.nombre
            },
            resolucion: {
                id: solicitud?.id_resolucion,
                nombre: solicitud?.id_resolucion_beca_resolucion.nombre,
                conResolucion: solicitud?.id_resolucion > 0 && solicitud.id_estado != 4,
                detalle: {
                    usuario: solicitud?.id_usuario_reso_usuario,
                    fecha: solicitud?.reso_fecha_hora,
                    comentario: solicitud?.res_comentario
                }
            },
            solicitante: {
                colegio: solicitud?.id_colegio_solic_colegio,
                usuario: solicitud?.id_usuario_solic_usuario
            },
            alumno: {
                nombre: solicitud?.alumno_nombre,
                apellido: solicitud?.alumno_apellido,
                dni: solicitud?.alumno_dni,
                nacimiento: solicitud?.alumno_fecha,
            },
            solicitado: {
                colegio: idRol === 0 ? solicitud.id_beca_beca.id_colegio_colegio : null,
            },
            baja: solicitud?.id_estado == 3,
            ...(solicitud?.id_estado === 3 && { detalle_baja: {
                    usuario: solicitud.id_usuario_baja_usuario,
                    fecha: solicitud.baja_fecha_hora,
                    comentario: solicitud.baja_comentario
                } })
        };
        return procesado;
    }
    catch (error) {
        throw error;
    }
};
exports.solicitudDetalle = solicitudDetalle;
//SOLICITUDES QUE YO ENVIE
const misSolicitudes = async (idRed, idColegio, idRol, idUsuario, idEstado, transaction) => {
    try {
        // Define la condición inicial de la consulta
        const whereCondition = {
            id_colegio_solic: idColegio,
            ...(idEstado >= 0 && { id_estado: idEstado })
        };
        // Agregar filtro por usuario si el idRol es mayor a 2
        if (parseInt(idRol) > 2) {
            whereCondition.id_usuario_solic = idUsuario;
        }
        const listado = await beca_solicitud_1.beca_solicitud.findAll({
            where: whereCondition,
            include: [
                {
                    model: beca_1.beca,
                    as: 'id_beca_beca',
                    where: {
                        id_red: idRed,
                    },
                    required: true,
                    include: [{
                            model: colegio_1.colegio,
                            as: 'id_colegio_colegio',
                            required: true
                        }]
                },
                {
                    model: usuario_1.usuario,
                    as: 'id_usuario_solic_usuario',
                    attributes: ['nombre', 'apellido'],
                    required: true,
                },
                {
                    model: beca_estado_1.beca_estado,
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
                solicitud: {
                    colegio: item.id_beca_beca.id_colegio_colegio.nombre,
                    alumno: item.alumno_apellido + ', ' + item.alumno_nombre
                }
            };
        });
        return procesado;
    }
    catch (error) {
        throw error;
    }
};
exports.misSolicitudes = misSolicitudes;
const miSolicitudDetalle = async (idSolicitud, idRed, idColegio, idRol, idUsuario, transaction) => {
    try {
        // Construye las condiciones iniciales
        const whereCondition = {
            id: idSolicitud,
        };
        // Agrega la condición adicional para roles > 2
        if (parseInt(idRol) > 2) {
            whereCondition.id_usuario_solic = idUsuario;
        }
        const solicitud = await beca_solicitud_1.beca_solicitud.findOne({
            where: whereCondition,
            include: [
                {
                    model: beca_1.beca,
                    as: 'id_beca_beca',
                    where: {
                        id_red: idRed,
                    },
                    required: true,
                    include: [{
                            model: colegio_1.colegio,
                            as: 'id_colegio_colegio',
                            required: true,
                        }]
                },
                {
                    model: colegio_1.colegio,
                    as: 'id_colegio_solic_colegio',
                    attributes: { exclude: ['terminos', 'suspendido', 'borrado'] },
                    include: [
                        {
                            model: zona_localidad_1.zona_localidad,
                            as: 'id_zona_zona_localidad',
                            attributes: ['nombre', 'id', 'id_zona'],
                            required: false,
                            include: [
                                {
                                    model: zona_1.zona,
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
                    model: usuario_1.usuario,
                    as: 'id_usuario_solic_usuario',
                    attributes: ['nombre', 'apellido', 'telefono', 'celular', 'email', 'foto'],
                    required: true,
                },
                {
                    model: beca_resolucion_1.beca_resolucion,
                    as: 'id_resolucion_beca_resolucion',
                    required: true,
                },
                {
                    model: usuario_1.usuario,
                    as: 'id_usuario_reso_usuario',
                    attributes: ['nombre', 'apellido', 'telefono', 'celular', 'email', 'foto'],
                    required: false,
                },
                {
                    model: beca_estado_1.beca_estado,
                    as: 'id_estado_beca_estado',
                    required: true,
                },
                {
                    model: usuario_1.usuario,
                    as: 'id_usuario_baja_usuario',
                    attributes: ['nombre', 'apellido', 'telefono', 'celular', 'email', 'foto'],
                    required: false,
                },
                {
                    model: usuario_1.usuario,
                    as: 'id_pariente_usuario',
                    attributes: ['nombre', 'apellido'],
                    required: true
                }
            ],
            transaction,
        });
        if (!solicitud) {
            const error = new Error('No se encontró la solicitud');
            error.statusCode = 400;
            throw error;
        }
        if (solicitud.sinLeerSolicitante == 1) {
            solicitud.sinLeerSolicitante = 0;
            await solicitud.save({ transaction });
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
                detalle: {
                    usuario: solicitud?.id_usuario_reso_usuario,
                    fecha: solicitud?.reso_fecha_hora,
                    comentario: solicitud?.res_comentario
                }
            },
            solicitante: {
                usuario: solicitud?.id_usuario_solic_usuario,
                pariente: solicitud?.id_pariente_usuario.apellido + ', ' + solicitud?.id_pariente_usuario.nombre,
            },
            solicitud: {
                colegio: solicitud?.id_beca_beca.id_colegio_colegio
            },
            alumno: {
                nombre: solicitud?.alumno_nombre,
                apellido: solicitud?.alumno_apellido,
                dni: solicitud?.alumno_dni,
                nacimiento: solicitud?.alumno_fecha,
            },
            baja: solicitud?.id_estado == 3,
            ...(solicitud?.id_estado === 3 && { detalle_baja: {
                    usuario: solicitud.id_usuario_baja_usuario,
                    fecha: solicitud.baja_fecha_hora,
                    comentario: solicitud.baja_comentario
                }
            })
        };
        return procesado;
    }
    catch (error) {
        throw error;
    }
};
exports.miSolicitudDetalle = miSolicitudDetalle;
const resolverSolicitud = async (resolver, idRed, idUsuario, idColegio, transaction) => {
    try {
        const estadoAprobada = 5;
        const estadoRechazada = 2;
        // Verifica que la beca solicitada existe
        const solicitud = await beca_solicitud_1.beca_solicitud.findOne({
            where: { id: resolver.id_solicitud },
            include: [
                {
                    model: beca_1.beca,
                    as: 'id_beca_beca',
                    where: {
                        id_colegio: idColegio,
                        id_red: idRed,
                        borrado: 0
                    },
                    required: true,
                    include: [{
                            model: colegio_1.colegio,
                            as: 'id_colegio_colegio'
                        }]
                },
                {
                    model: colegio_1.colegio,
                    as: 'id_colegio_solic_colegio'
                }
            ],
            transaction,
        });
        if (!solicitud) {
            const error = new Error('La Solicitud no existe');
            error.statusCode = 400;
            throw error;
        }
        if (resolver.id_resolucion === 1) {
            const fecha = new Date();
            // Resolución aprobada
            await solicitud.update({
                sinLeerSolicitante: 1,
                id_estado: estadoAprobada,
                id_resolucion: resolver.id_resolucion,
                id_usuario_reso: Number(idUsuario),
                reso_fecha_hora: fecha,
                res_comentario: resolver.res_comentario,
            }, { transaction });
            await matrices_service_1.BecaService.aprobarBeca(idColegio, idRed, transaction);
        }
        else if (resolver.id_resolucion === 2) {
            const fecha = new Date();
            // Resolución rechazada
            await solicitud.update({
                id_estado: estadoRechazada,
                id_resolucion: resolver.id_resolucion,
                id_usuario_reso: Number(idUsuario),
                reso_fecha_hora: fecha,
                res_comentario: resolver.res_comentario,
                sinLeerSolicitante: 1
            }, { transaction });
            await matrices_service_1.BecaService.rechazarBeca(solicitud.id_colegio_solic, idColegio, idRed, transaction);
        }
        return { solicitud, emailDestino: solicitud.id_colegio_solic_colegio.email, colegioSolicitud: solicitud.id_beca_beca.id_colegio_colegio.nombre };
    }
    catch (error) {
        throw error;
    }
};
exports.resolverSolicitud = resolverSolicitud;
const desestimarSolicitud = async (desestimar, idRed, idUsuario, idColegio, idRol, transaction) => {
    try {
        const whereCondition = {
            id: desestimar.id_solicitud,
        };
        // Agregar filtro por usuario si el idRol es mayor a 2
        if (parseInt(idRol) > 2) {
            whereCondition.id_usuario_solic = idUsuario;
        }
        // Verifica que la beca solicitada existe
        const solicitud = await beca_solicitud_1.beca_solicitud.findOne({
            where: whereCondition,
            include: [
                {
                    model: beca_1.beca,
                    as: 'id_beca_beca',
                    where: { id_red: idRed },
                    include: [
                        {
                            model: colegio_1.colegio,
                            as: 'id_colegio_colegio'
                        }
                    ],
                    required: true,
                },
                {
                    model: colegio_1.colegio,
                    as: 'id_colegio_solic_colegio'
                }
            ],
            transaction,
        });
        if (!solicitud) {
            const error = new Error('La Solicitud no existe');
            error.statusCode = 400;
            throw error;
        }
        const fecha = new Date();
        // Resolución aprobada
        await solicitud.update({
            id_estado: 1,
            id_resolucion: 3,
            id_usuario_reso: Number(idUsuario),
            reso_fecha_hora: fecha,
            res_comentario: desestimar.res_comentario,
            sinLeer: 1
        }, { transaction });
        await matrices_service_1.BecaService.desestimarBeca(idColegio, solicitud.id_beca_beca.id_colegio, idRed, transaction);
        return { solicitud, emailDestino: solicitud.id_beca_beca.id_colegio_colegio.email, colegioSolicitante: solicitud.id_colegio_solic_colegio.nombre };
    }
    catch (error) {
        throw error;
    }
};
exports.desestimarSolicitud = desestimarSolicitud;
const darBajaSolicitud = async (desestimar, idRed, idUsuario, idColegio, idRol, transaction) => {
    try {
        // Agregar filtro por usuario si el idRol es mayor a 2
        if (parseInt(idRol) > 2) {
            const error = new Error('No puede dar de baja una Beca');
            error.statusCode = 400;
            throw error;
        }
        // Verifica que la beca solicitada existe
        const solicitud = await beca_solicitud_1.beca_solicitud.findOne({
            where: {
                id: desestimar.id_solicitud
            },
            include: [
                {
                    model: beca_1.beca,
                    as: 'id_beca_beca',
                    where: { id_red: idRed },
                    include: [
                        {
                            model: colegio_1.colegio,
                            as: 'id_colegio_colegio'
                        }
                    ],
                    required: true,
                },
                {
                    model: colegio_1.colegio,
                    as: 'id_colegio_solic_colegio'
                }
            ],
            transaction,
        });
        if (!solicitud) {
            const error = new Error('La Solicitud no existe');
            error.statusCode = 400;
            throw error;
        }
        const fecha = new Date();
        // Pendiente de baja
        await solicitud.update({
            id_estado: 3,
            baja_fecha_hora: fecha,
            id_usuario_baja: Number(idUsuario),
            baja_comentario: desestimar.baja_comentario,
            sinLeerSolicitante: 1
        }, { transaction });
        // const redColegioSolicitado = await obtenerRedColegio(solicitud.id_colegio_solic, idRed, transaction);
        // const dbuTotal = redColegioSolicitado.dbu - 1;
        // const dbdTotal = redColegioSolicitado.db - dbuTotal;
        // await redColegioSolicitado.update(
        //     { dbu: dbuTotal, dbd: dbdTotal },
        //     { transaction }
        // );
        // const redColegio = await obtenerRedColegio(idColegio, idRed, transaction);
        // await actualizarRedColegio(redColegio, -1, 0, transaction);
        return { solicitud,
            emailDestino: solicitud.id_colegio_solic_colegio.email,
            colegio: solicitud.id_beca_beca.id_colegio_colegio.nombre
        };
    }
    catch (error) {
        throw error;
    }
};
exports.darBajaSolicitud = darBajaSolicitud;

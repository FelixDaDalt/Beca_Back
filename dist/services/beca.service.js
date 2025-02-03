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
const listadoBecas = async (idRed, idColegio, transaction) => {
    try {
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
        // Verifica red_colegio
        const listado = await beca_1.beca.findAll({
            where: {
                id_red: idRed,
                borrado: 0
            },
            attributes: ['id', 'cantidad', 'fecha_hora'],
            include: [
                {
                    model: colegio_1.colegio,
                    as: 'id_colegio_colegio',
                    required: true,
                    attributes: { exclude: ['borrado', 'suspendido', 'terminos'] }
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
            where: {
                id_red: redColegio.id_red,
                id_colegio: redColegio.id_colegio,
                borrado: 0
            },
            transaction // Pasa la transacción
        });
        if (!becaActualizar) {
            // Crear nueva beca
            const nuevaBeca = {
                id_red: Number(idRed),
                id_colegio: Number(idColegio),
                id_usuario: Number(idUsuario),
                cantidad: altaBeca.cantidad
            };
            const becaCreada = await beca_1.beca.create(nuevaBeca, { transaction });
            await actualizarMatricesAlta(redColegio, altaBeca, transaction);
            await redColegio.save({ transaction });
            return becaCreada;
        }
        // Actualizar beca existente
        becaActualizar.cantidad = altaBeca.cantidad;
        becaActualizar.fecha_hora = new Date();
        await becaActualizar.save({ transaction });
        await actualizarMatricesAlta(redColegio, altaBeca, transaction);
        await redColegio.save({ transaction });
        return becaActualizar;
    }
    catch (error) {
        throw error;
    }
};
exports.altaBeca = altaBeca;
const solicitarBeca = async (solicitud, idRed, idUsuario, idColegio, transaction) => {
    try {
        // Verifica que el colegio solicitate pertenece a la red
        const redColegioSolicitante = await red_colegio_1.red_colegio.findOne({
            where: { id_colegio: idColegio, id_red: idRed, borrado: 0 },
            transaction
        });
        if (!redColegioSolicitante) {
            const error = new Error('El colegio no pertenece a la Red');
            error.statusCode = 400;
            throw error;
        }
        // Verifica que la beca solicitada existe
        const becaSolicitada = await beca_1.beca.findOne({
            where: { id: solicitud.id_beca },
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
            id_colegio_solic: Number(idColegio),
            id_usuario_solic: Number(idUsuario),
            alumno_nombre: alumno.nombre,
            alumno_apellido: alumno.apellido,
            alumno_fecha: alumno.fecha_nacimiento,
            alumno_dni: alumno.dni,
            detalle: alumno.detalle
        }));
        // Inserta todas las solicitudes de una sola vez y devuelve las creadas
        const solicitudesCreadas = await beca_solicitud_1.beca_solicitud.bulkCreate(solicitudes, { transaction, returning: true });
        // Actualiza las matrices para ambos colegios
        await actualizarMatricesSolicitud(redColegioSolicitante, redColegioReceptor, solicitudes.length, transaction);
        return solicitudesCreadas;
    }
    catch (error) {
        throw error;
    }
};
exports.solicitarBeca = solicitarBeca;
const listadoSolicitudes = async (idRed, idColegio, idEstado, transaction) => {
    try {
        const listado = await beca_solicitud_1.beca_solicitud.findAll({
            where: {
                id_estado: idEstado
            },
            include: [{
                    model: beca_1.beca,
                    as: 'id_beca_beca',
                    where: {
                        id_colegio: idColegio,
                        id_red: idRed
                    },
                    required: true
                },
                {
                    model: colegio_1.colegio,
                    as: 'id_colegio_solic_colegio',
                    attributes: ['nombre'],
                    required: true
                }, {
                    model: usuario_1.usuario,
                    as: 'id_usuario_solic_usuario',
                    attributes: ['nombre', 'apellido'],
                    required: true,
                },
                {
                    model: beca_estado_1.beca_estado,
                    as: 'id_estado_beca_estado',
                    required: true
                }],
            transaction // Asegúrate de pasar la transacción
        });
        const procesado = listado.map(item => {
            return {
                id: item.id,
                fecha: item.fecha_hora,
                estado: {
                    id: item.id_estado,
                    nombre: item.id_estado_beca_estado.nombre
                },
                solicitante: {
                    colegio: item.id_colegio_solic_colegio.nombre,
                    usuario: item.id_usuario_solic_usuario.apellido + ', ' + item.id_usuario_solic_usuario.nombre,
                    alumno: item.alumno_apellido + ', ' + item.alumno_nombre
                },
            };
        });
        return procesado;
    }
    catch (error) {
        throw error;
    }
};
exports.listadoSolicitudes = listadoSolicitudes;
const solicitudDetalle = async (idSolicitud, idRed, idColegio, transaction) => {
    try {
        const solicitud = await beca_solicitud_1.beca_solicitud.findOne({
            where: {
                id: idSolicitud,
            },
            include: [{
                    model: beca_1.beca,
                    as: 'id_beca_beca',
                    where: {
                        id_colegio: idColegio,
                        id_red: idRed
                    },
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
        const procesado = {
            id: solicitud?.id,
            detalle: solicitud?.detalle,
            fecha: solicitud?.fecha_hora,
            estado: {
                id: solicitud?.id_estado,
                nombre: solicitud?.id_estado_beca_estado.nombre
            },
            resolucion: {
                id: solicitud?.id_resolucion,
                nombre: solicitud?.id_resolucion_beca_resolucion.nombre,
                conResolucion: solicitud?.id_resolucion > 0,
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
const misSolicitudes = async (idRed, idColegio, idRol, idUsuario, idEstado, transaction) => {
    try {
        // Define la condición inicial de la consulta
        const whereCondition = {
            id_colegio_solic: idColegio,
            id_estado: idEstado
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
                },
            ],
            transaction, // Asegúrate de pasar la transacción
        });
        const procesado = listado.map(item => {
            return {
                id: item.id,
                fecha: item.fecha_hora,
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
            ],
            transaction,
        });
        if (!solicitud) {
            const error = new Error('No se encontró la solicitud');
            error.statusCode = 400;
            throw error;
        }
        const procesado = {
            id: solicitud?.id,
            detalle: solicitud?.detalle,
            fecha: solicitud?.fecha_hora,
            estado: {
                id: solicitud?.id_estado,
                nombre: solicitud?.id_estado_beca_estado.nombre,
            },
            resolucion: {
                id: solicitud?.id_resolucion,
                nombre: solicitud?.id_resolucion_beca_resolucion.nombre,
                conResolucion: solicitud?.id_resolucion > 0,
                detalle: {
                    usuario: solicitud?.id_usuario_reso_usuario,
                    fecha: solicitud?.reso_fecha_hora,
                    comentario: solicitud?.res_comentario
                }
            },
            solicitante: {
                usuario: solicitud?.id_usuario_solic_usuario,
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
                    where: { id_colegio: idColegio, id_red: idRed },
                    required: true,
                },
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
                id_estado: estadoAprobada,
                id_resolucion: resolver.id_resolucion,
                id_usuario_reso: Number(idUsuario),
                reso_fecha_hora: fecha,
                res_comentario: resolver.res_comentario,
            }, { transaction });
            const redColegio = await obtenerRedColegio(idColegio, idRed, transaction);
            await actualizarRedColegio(redColegio, -1, 1, transaction);
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
            }, { transaction });
            const redColegio = await obtenerRedColegio(idColegio, idRed, transaction);
            await actualizarRedColegio(redColegio, -1, 0, transaction);
            const redColegioSolicitante = await obtenerRedColegio(solicitud.id_colegio_solic, idRed, transaction);
            const dbuTotal = redColegioSolicitante.dbu - 1;
            const dbdTotal = redColegioSolicitante.db - dbuTotal;
            await redColegioSolicitante.update({ dbu: dbuTotal, dbd: dbdTotal }, { transaction });
        }
        return solicitud;
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
                    required: true,
                },
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
            id_resolucion: desestimar.id_resolucion,
            id_usuario_reso: Number(idUsuario),
            reso_fecha_hora: fecha,
            res_comentario: desestimar.res_comentario,
        }, { transaction });
        const redColegio = await obtenerRedColegio(idColegio, idRed, transaction);
        const dbuTotal = redColegio.dbu - 1;
        const dbdTotal = redColegio.db - dbuTotal;
        await redColegio.update({ dbu: dbuTotal, dbd: dbdTotal }, { transaction });
        const redColegioSolicitado = await obtenerRedColegio(solicitud.id_beca_beca.id_colegio, idRed, transaction);
        await actualizarRedColegio(redColegioSolicitado, -1, 0, transaction);
        return solicitud;
    }
    catch (error) {
        throw error;
    }
};
exports.desestimarSolicitud = desestimarSolicitud;
const darBajaSolicitud = async (desestimar, idRed, idUsuario, idColegio, idRol, transaction) => {
    try {
        const whereCondition = {
            id: desestimar.id_solicitud,
        };
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
                    required: true,
                },
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
            id_estado: 3,
            id_resolucion: desestimar.id_resolucion,
            baja_fecha_hora: fecha,
            id_usuario_baja: Number(idUsuario),
            baja_comentario: desestimar.baja_comentario,
        }, { transaction });
        const redColegioSolicitado = await obtenerRedColegio(solicitud.id_colegio_solic, idRed, transaction);
        const dbuTotal = redColegioSolicitado.dbu - 1;
        const dbdTotal = redColegioSolicitado.db - dbuTotal;
        await redColegioSolicitado.update({ dbu: dbuTotal, dbd: dbdTotal }, { transaction });
        // const redColegio = await obtenerRedColegio(idColegio, idRed, transaction);
        // await actualizarRedColegio(redColegioSolicitado, -1, 0, transaction);
        return solicitud;
    }
    catch (error) {
        throw error;
    }
};
exports.darBajaSolicitud = darBajaSolicitud;
///ACTUALIZAR MATRICES
//ALTA
const actualizarMatricesAlta = async (redColegio, // Registro del colegio en la red
altaBeca, // Datos de la beca a publicar
transaction) => {
    try {
        // Variables base
        const BO = altaBeca.cantidad; // Becas ofrecidas
        const DBU = redColegio.dbu || 0; // Derecho a Becas Utilizadas
        const BSP = redColegio.bsp || 0; // Becas Solicitadas Propias
        const BSA = redColegio.bsa || 0; // Becas Solicitadas Aprobadas
        // Cálculos
        const BTP = BO + 2; // Becas Totales Publicadas
        const DB = BO; // Derecho a Becas
        const DBD = DB - DBU; // Derecho a Becas Disponibles
        const BDE = BTP - BSP - BSA; // Becas Disponibles en total
        // Actualizar las métricas en red_colegio
        redColegio.bp = BO; // Becas Publicadas
        redColegio.btp = BTP; // Becas Totales Publicadas
        redColegio.db = DB; // Derecho a Becas
        redColegio.dbd = DBD; // Derecho a Becas Disponibles
        redColegio.bde = BDE; // Becas Disponibles
        // Guardar los cambios en la base de datos
        await redColegio.save({ transaction });
        return redColegio;
    }
    catch (error) {
        throw new Error(`Error al actualizar las matrices del colegio: ${error.message}`);
    }
};
//SOLICITUD
const actualizarMatricesSolicitud = async (redColegioSolicitante, // Colegio que solicita la beca
redColegioReceptor, // Colegio que recibe la solicitud
cantidadSolicitudes, // Número de solicitudes realizadas
transaction) => {
    try {
        // Actualizar el colegio que solicita (incrementar DBU - Derecho a Becas Utilizadas)
        redColegioSolicitante.dbu = (redColegioSolicitante.dbu || 0) + cantidadSolicitudes;
        // Calcular DB disponibles después del incremento en DBU
        redColegioSolicitante.dbd = (redColegioSolicitante.db || 0) - redColegioSolicitante.dbu;
        // Actualizar el colegio que recibe la solicitud (incrementar BSP - Becas Solicitadas Propias)
        redColegioReceptor.bsp = (redColegioReceptor.bsp || 0) + cantidadSolicitudes;
        // Calcular BDE (Becas Disponibles en la red) después del incremento en BSP
        redColegioReceptor.bde = (redColegioReceptor.btp || 0) - redColegioReceptor.bsp - (redColegioReceptor.bsa || 0);
        // Guardar cambios para ambos colegios
        await Promise.all([
            redColegioSolicitante.save({ transaction }),
            redColegioReceptor.save({ transaction })
        ]);
        return { redColegioSolicitante, redColegioReceptor };
    }
    catch (error) {
        throw new Error(`Error al actualizar las matrices de solicitud: ${error.message}`);
    }
};
const actualizarRedColegio = async (redColegio, bspDelta, bsaDelta, transaction) => {
    const bspTotal = redColegio.bsp + bspDelta;
    const bsaTotal = redColegio.bsa + bsaDelta;
    const bdeTotal = redColegio.btp - bsaTotal - bspTotal;
    await redColegio.update({ bsp: bspTotal, bsa: bsaTotal, bde: bdeTotal }, { transaction });
};
const obtenerRedColegio = async (idColegio, idRed, transaction) => {
    const redColegio = await red_colegio_1.red_colegio.findOne({
        where: { id_colegio: idColegio, id_red: idRed },
        transaction,
    });
    if (!redColegio) {
        const error = new Error(`No se encontró la red colegio con id_colegio ${idColegio} e id_red ${idRed}`);
        error.statusCode = 400;
        throw error;
    }
    return redColegio;
};

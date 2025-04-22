"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificarBecasVencidas = notificarBecasVencidas;
exports.notificarBecasPorVencer = notificarBecasPorVencer;
exports.procesarBecasDadaBaja = procesarBecasDadaBaja;
exports.comprobarRed = comprobarRed;
exports.sincronizarRedColegios = sincronizarRedColegios;
exports.obtenerParametro = obtenerParametro;
const beca_1 = require("../models/beca");
const database_1 = __importDefault(require("../config/database"));
const beca_solicitud_1 = require("../models/beca_solicitud");
const node_cron_1 = __importDefault(require("node-cron"));
const sequelize_1 = require("sequelize");
const colegio_1 = require("../models/colegio");
const red_colegio_1 = require("../models/red_colegio");
const email_service_1 = require("../services/email.service");
const beca_automatizacion_log_1 = require("../models/beca_automatizacion_log");
const notificaciones_1 = require("../models/notificaciones");
const beca_automatizacion_ejecucion_1 = require("../models/beca_automatizacion_ejecucion");
const red_1 = require("../models/red");
const parametros_1 = require("../models/parametros");
// 🎯 Becas Vencidas
async function notificarBecasVencidas() {
    console.log("🔎 1 - Verificando becas vencidas...");
    const diasVenc = Number(await obtenerParametro('dias_venc')) || 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    // 🚀 LECTURA SIN transacción
    const becasVencidas = await beca_solicitud_1.beca_solicitud.findAll({
        where: {
            id_estado: 0,
            notificarVencida: 0,
            [sequelize_1.Op.and]: [
                sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('DATE_ADD', sequelize_1.Sequelize.col('beca_solicitud.fecha_hora'), sequelize_1.Sequelize.literal(`INTERVAL ${diasVenc} DAY`)), { [sequelize_1.Op.lt]: hoy })
            ]
        },
        include: [{ model: beca_1.beca, as: "id_beca_beca", attributes: ["id_colegio", "id_red"] }]
    });
    if (becasVencidas.length === 0) {
        console.log("✅ Exit - No hay becas vencidas.");
        const ejecucion = await registrarEjecucionAutomatizacion('VENCIDA', 'EXITO', becasVencidas.length, null);
        return {
            id: ejecucion.id,
            becasProcesadas: 0,
            colegiosInvolucrados: []
        };
    }
    const colegiosIds = [
        ...new Set(becasVencidas.flatMap(b => [b.id_colegio_solic, b.id_beca_beca.id_colegio]))
    ];
    const colegios = await colegio_1.colegio.findAll({
        where: { id: { [sequelize_1.Op.in]: colegiosIds } },
        attributes: ["id", "email", "nombre"]
    });
    const colegiosMap = colegios.reduce((acc, colegio) => {
        acc[colegio.id] = { email: colegio.email, nombre: colegio.nombre };
        return acc;
    }, {});
    console.log("✅ Becas y colegios leídos correctamente.");
    // 🚀 ESCRITURA CON transacción
    const t = await database_1.default.transaction();
    let ejecucion = null;
    try {
        console.log("⏳ 2 - Registrando inicio de ejecución...");
        // 👇 Crear registro de ejecución
        ejecucion = await registrarEjecucionAutomatizacion('VENCIDA', 'EXITO', becasVencidas.length, null, t);
        console.log("✅ Registro de ejecución creado:", ejecucion.id);
        console.log("⏳ 3 - Actualizando estados y red_colegio...");
        await beca_solicitud_1.beca_solicitud.update({ id_estado: 4, id_resolucion: 3, notificarVencida: 1 }, { where: { id: becasVencidas.map(b => b.id) }, transaction: t });
        await notificaciones_1.notificaciones.update({ vencida: 1, leido_ofer: 0, leido_solic: 0 }, { where: { id_solicitud: becasVencidas.map(b => b.id) }, transaction: t });
        await actualizarRedColegiosVencimientoSQL(becasVencidas, t);
        console.log("⏳ 4 - Registrando logs de becas...");
        const logs = becasVencidas.map(beca => ({
            id_beca_solicitud: beca.id,
            id_estado_anterior: 0,
            id_estado_nuevo: 4,
            tipo_notificacion: 'VENCIDA',
            email_colegio_solicitante: colegiosMap[beca.id_colegio_solic]?.email,
            email_colegio_ofrecio: colegiosMap[beca.id_beca_beca.id_colegio]?.email,
            motivo: "Vencimiento automático",
            id_ejecucion: ejecucion.id // 👈 Guardar el id de esta ejecución
        }));
        await beca_automatizacion_log_1.beca_automatizacion_log.bulkCreate(logs, { transaction: t });
        await t.commit();
        console.log("✅ Becas vencidas procesadas correctamente.");
        // 🚀 RESPUESTA
        return {
            id: ejecucion.id,
            becasProcesadas: becasVencidas.length,
            colegiosInvolucrados: becasVencidas.map(beca => ({
                beca: beca.id,
                colegioSolicitante: colegiosMap[beca.id_colegio_solic]?.nombre || 'Desconocido',
                colegioOfrecio: colegiosMap[beca.id_beca_beca.id_colegio]?.nombre || 'Desconocido'
            }))
        };
    }
    catch (error) {
        console.error("❌ Error al procesar becas vencidas:", error);
        await t.rollback();
        // 👇 Crear registro de ejecución fallida
        ejecucion = await registrarEjecucionAutomatizacion('VENCIDA', 'ERROR', becasVencidas.length, null, t);
        throw error;
    }
}
// 🎯 Becas Por Vencer
async function notificarBecasPorVencer() {
    console.log("🔎 1 - Verificando becas por vencer...");
    const diasVenc = Number(await obtenerParametro('dias_venc')) || 0;
    const diasNotif = Number(await obtenerParametro('dias_notif_venc')) || 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const becasPorVencer = await beca_solicitud_1.beca_solicitud.findAll({
        where: {
            id_estado: 0,
            notificarPorVencer: 0,
            [sequelize_1.Op.and]: [
                sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('DATE', sequelize_1.Sequelize.literal(`DATE_ADD(DATE_ADD(beca_solicitud.fecha_hora, INTERVAL ${diasVenc} DAY), INTERVAL -${diasNotif} DAY)`)), { [sequelize_1.Op.lte]: hoy })
            ]
        },
        include: [{ model: beca_1.beca, as: "id_beca_beca", attributes: ["id_colegio"] }]
    });
    if (becasPorVencer.length === 0) {
        console.log("✅ Exit - No hay becas próximas a vencer.");
        const ejecucion = await registrarEjecucionAutomatizacion('POR_VENCER', 'EXITO', becasPorVencer.length);
        return {
            id: ejecucion.id,
            becasProcesadas: 0,
            colegiosInvolucrados: []
        };
    }
    const colegiosIds = [
        ...new Set(becasPorVencer.flatMap(b => [b.id_colegio_solic, b.id_beca_beca.id_colegio]))
    ];
    const colegios = await colegio_1.colegio.findAll({
        where: { id: { [sequelize_1.Op.in]: colegiosIds } },
        attributes: ["id", "email", "nombre"]
    });
    const colegiosMap = colegios.reduce((acc, colegio) => {
        acc[colegio.id] = { email: colegio.email, nombre: colegio.nombre };
        return acc;
    }, {});
    console.log("✅ Becas y colegios leídos correctamente.");
    // 🚀 INICIO de transacción
    const t = await database_1.default.transaction();
    let ejecucion = null;
    try {
        console.log("⏳ 2 - Registrando inicio de ejecución...");
        // 👇 Crear registro de ejecución
        ejecucion = await registrarEjecucionAutomatizacion('POR_VENCER', 'EXITO', becasPorVencer.length, null, t);
        console.log("✅ Registro de ejecución creado:", ejecucion.id);
        console.log("⏳ 3 - Actualizando estado de notificaciones...");
        await beca_solicitud_1.beca_solicitud.update({ notificarPorVencer: 1, sinLeerSolicitante: 1, sinLeer: 1 }, { where: { id: becasPorVencer.map(b => b.id) }, transaction: t });
        await notificaciones_1.notificaciones.update({ porvencer: 1, leido_ofer: 0, leido_solic: 0 }, { where: { id_solicitud: becasPorVencer.map(b => b.id) }, transaction: t });
        console.log("⏳ 4 - Registrando logs de cada beca...");
        const logs = becasPorVencer.map(beca => ({
            id_beca_solicitud: beca.id,
            id_estado_anterior: 0,
            id_estado_nuevo: 0,
            tipo_notificacion: 'POR_VENCER',
            email_colegio_solicitante: colegiosMap[beca.id_colegio_solic]?.email,
            email_colegio_ofrecio: colegiosMap[beca.id_beca_beca.id_colegio]?.email,
            motivo: "POR VENCER automático",
            id_ejecucion: ejecucion.id // 👈 Enlazar cada log con la ejecución
        }));
        await beca_automatizacion_log_1.beca_automatizacion_log.bulkCreate(logs, { transaction: t });
        await t.commit();
        console.log("✅ Becas por vencer procesadas correctamente.");
        return {
            id: ejecucion.id,
            becasProcesadas: becasPorVencer.length,
            colegiosInvolucrados: becasPorVencer.map(beca => ({
                beca: beca.id,
                colegioSolicitante: colegiosMap[beca.id_colegio_solic]?.nombre || 'Desconocido',
                colegioOfrecio: colegiosMap[beca.id_beca_beca.id_colegio]?.nombre || 'Desconocido'
            }))
        };
    }
    catch (error) {
        console.error("❌ Error al procesar becas por vencer:", error);
        await t.rollback();
        // 👇 Crear registro de ejecución fallida
        await registrarEjecucionAutomatizacion('POR_VENCER', 'ERROR', 0, error.message);
        throw error;
    }
}
/////////////////////////////////
async function procesarBecasDadaBaja() {
    console.log("🔎 1 - Verificando becas pendientes de baja...");
    // 🚀 LECTURA SIN transacción
    const becasPendientes = await beca_solicitud_1.beca_solicitud.findAll({
        where: { id_estado: 3 },
        include: [{ model: beca_1.beca, as: "id_beca_beca", attributes: ["id_colegio", "id_red"] }],
    });
    if (becasPendientes.length === 0) {
        console.log("✅ No hay becas pendientes de baja.");
        const ejecucion = await registrarEjecucionAutomatizacion('BAJA', 'EXITO', becasPendientes.length);
        return { id: ejecucion.id, becasProcesadas: 0, colegiosInvolucrados: [] };
    }
    console.log(`⏳ 2 - Procesando ${becasPendientes.length} becas...`);
    const colegiosIds = [
        ...new Set(becasPendientes.flatMap(b => [b.id_colegio_solic, b.id_beca_beca.id_colegio])),
    ];
    const colegios = await colegio_1.colegio.findAll({
        where: { id: { [sequelize_1.Op.in]: colegiosIds } },
        attributes: ["id", "email", "nombre"],
    });
    const colegiosMap = colegios.reduce((acc, colegio) => {
        acc[colegio.id] = { email: colegio.email, nombre: colegio.nombre };
        return acc;
    }, {});
    // 🚀 ESCRITURA CON transacción
    const t = await database_1.default.transaction();
    let ejecucion = null;
    try {
        console.log("⏳ 3 - Registrando inicio de ejecución...");
        // 👇 Crear registro de ejecución
        ejecucion = await registrarEjecucionAutomatizacion('BAJA', 'EXITO', becasPendientes.length, null, t);
        console.log("✅ Registro de ejecución creado:", ejecucion.id);
        console.log("⏳ 4 - Actualizando estados y red_colegio...");
        await beca_solicitud_1.beca_solicitud.update({ id_estado: 6 }, { where: { id_estado: 3 }, transaction: t });
        await actualizarRedColegiosBajaSQL(becasPendientes, t);
        console.log("⏳ 5 - Registrando logs...");
        await beca_automatizacion_log_1.beca_automatizacion_log.bulkCreate(becasPendientes.map(({ id, id_colegio_solic, id_beca_beca }) => ({
            id_beca_solicitud: id,
            id_estado_anterior: 3,
            id_estado_nuevo: 6,
            tipo_notificacion: 'BAJA',
            email_colegio_solicitante: colegiosMap[id_colegio_solic]?.email,
            email_colegio_ofrecio: colegiosMap[id_beca_beca.id_colegio]?.email,
            motivo: "Baja automática",
            id_ejecucion: ejecucion.id // 👈 Relacionar cada log con esta ejecución
        })), { transaction: t });
        await t.commit();
        console.log("✅ Base de datos actualizada correctamente.");
        console.log(`⏳ 6 - Enviando correos...`);
        const enviar = (email, asunto, mensaje) => {
            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout alcanzado para el envío de correo')), 15000));
            const enviar = (0, email_service_1.enviarCorreo)(email, asunto, mensaje, `<h1>${asunto}</h1><p>${mensaje}</p>`);
            return Promise.race([enviar, timeout]);
        };
        const correoPromises = becasPendientes.map(async (beca) => {
            const colegioSolicitante = colegiosMap[beca.id_colegio_solic];
            const colegioOfrecio = colegiosMap[beca.id_beca_beca.id_colegio];
            try {
                await Promise.all([
                    enviar(colegioSolicitante?.email, "📌 Beca Dada de Baja", `La beca solicitada a ${colegioOfrecio?.nombre} ha sido dada de baja.`),
                    enviar(colegioOfrecio?.email, "📌 Beca Dada de Baja", `Una beca solicitada por ${colegioSolicitante?.nombre} ha sido dada de baja.`),
                ]);
            }
            catch (error) {
                console.error(`⚠️ Error al enviar correo:`, error);
            }
        });
        await Promise.all(correoPromises);
        console.log("📨 Correos enviados correctamente.");
        console.log("✅ Exit - Becas procesadas.");
        return {
            id: ejecucion.id,
            becasProcesadas: becasPendientes.length,
            colegiosInvolucrados: becasPendientes.map(beca => ({
                beca: beca.id,
                colegioSolicitante: colegiosMap[beca.id_colegio_solic]?.nombre || 'Desconocido',
                colegioOfrecio: colegiosMap[beca.id_beca_beca.id_colegio]?.nombre || 'Desconocido'
            }))
        };
    }
    catch (error) {
        console.error("❌ Error al procesar becas dadas de baja:", error);
        await t.rollback();
        // 👇 Crear registro de ejecución fallida
        await registrarEjecucionAutomatizacion('BAJA', 'ERROR', 0, error.message);
        throw error;
    }
}
async function comprobarRed(idRed, debug = true) {
    try {
        const whereRed = { borrado: 0 };
        if (idRed)
            whereRed.id = idRed;
        const redes = await red_1.red.findAll({
            where: whereRed,
            attributes: ['id', 'nombre'],
            raw: true
        });
        const resultado = await Promise.all(redes.map(async (unaRed) => {
            const miembros = await red_colegio_1.red_colegio.findAll({
                where: { id_red: unaRed.id, borrado: 0 },
                include: [{
                        model: colegio_1.colegio,
                        as: 'id_colegio_colegio',
                        attributes: ['id', 'nombre']
                    }],
                raw: true,
                nest: true
            });
            const colegiosConCheck = await Promise.all(miembros.map(async (miembro) => {
                const idColegio = miembro.id_colegio;
                // 1. Becas publicadas (SUM de cantidad)
                const bp_real = await beca_1.beca.sum('cantidad', {
                    where: { id_colegio: idColegio, id_red: unaRed.id, borrado: 0 }
                }) || 0;
                // 2. Becas totales propias
                const btp_real = bp_real > 0 ? bp_real + 2 : 0;
                // 3. db = bp
                const db_real = bp_real;
                // 4. dbu = solicitudes activas del colegio
                const dbu_real = await beca_solicitud_1.beca_solicitud.count({
                    where: {
                        id_colegio_solic: idColegio,
                        id_estado: { [sequelize_1.Op.in]: [0, 3, 5] }
                    },
                    include: [{
                            model: beca_1.beca,
                            as: 'id_beca_beca',
                            required: true,
                            where: { id_red: unaRed.id }
                        }]
                });
                // 5. dbd = db - dbu
                const dbd_real = db_real - dbu_real;
                // 6. bsp = solicitudes pendientes HACIA el colegio
                const bsp_real = await beca_solicitud_1.beca_solicitud.count({
                    where: {
                        id_estado: 0
                    },
                    include: [{
                            model: beca_1.beca,
                            as: 'id_beca_beca',
                            required: true,
                            where: {
                                id_red: unaRed.id,
                                id_colegio: idColegio
                            }
                        }]
                });
                // 7. bsa = solicitudes aprobadas HACIA el colegio
                const bsa_real = await beca_solicitud_1.beca_solicitud.count({
                    where: {
                        id_estado: { [sequelize_1.Op.in]: [3, 5] }
                    },
                    include: [{
                            model: beca_1.beca,
                            as: 'id_beca_beca',
                            required: true,
                            where: {
                                id_red: unaRed.id,
                                id_colegio: idColegio
                            }
                        }]
                });
                // 8. bde = btp - bsa - bsp
                const bde_real = btp_real - bsa_real - bsp_real;
                // 📌 Comparación con los valores almacenados
                const checks = {
                    checkBP: miembro.bp === bp_real,
                    checkBTP: miembro.btp === btp_real,
                    checkDB: miembro.db === db_real,
                    checkDBU: miembro.dbu === dbu_real,
                    checkDBD: miembro.dbd === dbd_real,
                    checkBSP: miembro.bsp === bsp_real,
                    checkBSA: miembro.bsa === bsa_real,
                    checkBDE: miembro.bde === bde_real,
                    checkCantidadMinima: bp_real >= dbu_real
                };
                const testCheck = Object.values(checks).every(Boolean);
                if (!debug) {
                    return {
                        id: miembro.id_colegio_colegio.id,
                        nombre: miembro.id_colegio_colegio.nombre,
                        ...checks,
                        testCheck
                    };
                }
                else {
                    const reales = {
                        bp: bp_real,
                        btp: btp_real,
                        db: db_real,
                        dbu: dbu_real,
                        dbd: dbd_real,
                        bsp: bsp_real,
                        bsa: bsa_real,
                        bde: bde_real,
                        cantidadminima: bp_real
                    };
                    const esperados = {
                        bp: bp_real,
                        btp: bp_real > 0 ? bp_real + 2 : 0,
                        db: bp_real,
                        dbu: dbu_real,
                        dbd: bp_real - dbu_real,
                        bsp: bsp_real,
                        bsa: bsa_real,
                        bde: btp_real - bsa_real - bsp_real,
                        cantidadminima: dbu_real
                    };
                    return {
                        id: miembro.id_colegio_colegio.id,
                        nombre: miembro.id_colegio_colegio.nombre,
                        ...Object.fromEntries(Object.entries(checks).map(([key, value]) => {
                            const prop = key.replace('check', '').toLowerCase();
                            return [
                                key,
                                {
                                    ok: value,
                                    esperado: esperados[prop],
                                    real: miembro[prop]
                                }
                            ];
                        })),
                        testCheck
                    };
                }
            }));
            return {
                red: unaRed,
                colegios: colegiosConCheck
            };
        }));
        return resultado;
    }
    catch (error) {
        throw error;
    }
}
async function sincronizarRedColegios(idRed) {
    const transaction = await database_1.default.transaction();
    try {
        if (!idRed) {
            return;
        }
        const miembros = await red_colegio_1.red_colegio.findAll({
            where: { id_red: idRed, borrado: 0 },
            include: [{ model: colegio_1.colegio, as: 'id_colegio_colegio' }],
            transaction
        });
        const resultados = [];
        for (const miembro of miembros) {
            const idColegio = miembro.id_colegio;
            // 📚 Becas Publicadas
            const becasPublicadas = await beca_1.beca.sum('cantidad', {
                where: { id_colegio: idColegio, id_red: idRed, borrado: 0 },
                transaction
            }) || 0;
            const btp = becasPublicadas > 0 ? becasPublicadas + 2 : 0;
            // 📜 Becas Solicitadas Propias (pendientes)
            const becasSolicitadasPropias = await beca_solicitud_1.beca_solicitud.count({
                where: {
                    id_estado: 0
                },
                include: [{
                        model: beca_1.beca,
                        as: 'id_beca_beca',
                        required: true,
                        where: {
                            id_red: idRed,
                            id_colegio: idColegio
                        }
                    }],
                transaction
            });
            // 📜 Becas Solicitadas Aprobadas (aprobadas o pendiente de baja)
            const becasSolicitadasAprobadas = await beca_solicitud_1.beca_solicitud.count({
                where: {
                    id_colegio_solic: idColegio,
                    id_estado: { [sequelize_1.Op.in]: [3, 5] }
                },
                include: [{
                        model: beca_1.beca,
                        as: 'id_beca_beca',
                        required: true,
                        where: { id_red: idRed }
                    }],
                transaction
            });
            // 📜 Derecho utilizado (cuando solicita y se encuentra en 0, 3 o 5)
            const derechoUtilizado = await beca_solicitud_1.beca_solicitud.count({
                where: {
                    id_colegio_solic: idColegio,
                    id_estado: { [sequelize_1.Op.in]: [0, 3, 5] }
                },
                include: [{
                        model: beca_1.beca,
                        as: 'id_beca_beca',
                        required: true,
                        where: { id_red: idRed }
                    }],
                transaction
            });
            // 📜 ❗ Becas que el colegio ofreció y fueron aprobadas
            const becasOfrecidasAprobadas = await beca_solicitud_1.beca_solicitud.count({
                where: { id_estado: { [sequelize_1.Op.in]: [3, 5] } },
                include: [{
                        model: beca_1.beca,
                        as: 'id_beca_beca',
                        required: true,
                        where: { id_colegio: idColegio, id_red: idRed }
                    }],
                transaction
            });
            // 📚 Recalcular campos
            const db = becasPublicadas; // derecho a beca = becas publicadas
            const dbu = derechoUtilizado; // derecho utilizado
            const dbd = db - dbu; // derecho disponible
            const bsp = becasSolicitadasPropias; // becas solicitadas propias
            const bsa = becasOfrecidasAprobadas; // 🔥 becas solicitadas aprobadas (como oferente)
            const bde = btp - bsa - bsp; // becas disponibles
            // 🔧 Update
            await red_colegio_1.red_colegio.update({
                bp: becasPublicadas,
                btp,
                db,
                dbu,
                dbd,
                bsp,
                bsa,
                bde
            }, {
                where: { id_red: idRed, id_colegio: idColegio },
                transaction
            });
            resultados.push({
                id_colegio: idColegio,
                nombre: miembro.id_colegio_colegio.nombre,
                actualizacion: {
                    bp: becasPublicadas,
                    btp,
                    db,
                    dbu,
                    dbd,
                    bsp,
                    bsa, // Ahora sí correctamente
                    bde
                }
            });
        }
        await transaction.commit();
        return resultados;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
;
///// FUNCIONES INTERNAS ////
async function actualizarRedColegiosVencimientoSQL(becasPendientes, transaction) {
    // 🔵 Agrupamos cantidad de solicitudes por colegio solicitante
    const cantidadSolicitantes = becasPendientes.reduce((acc, beca) => {
        const key = `${beca.id_colegio_solic}-${beca.id_beca_beca.id_red}`; // 👈 Usamos combinación ID colegio + ID red
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    // 🟠 Agrupamos cantidad de oferentes
    const cantidadOferentes = becasPendientes.reduce((acc, beca) => {
        const key = `${beca.id_beca_beca.id_colegio}-${beca.id_beca_beca.id_red}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    // 🚀 Primero actualizar DBU (solicitantes)
    if (Object.keys(cantidadSolicitantes).length > 0) {
        const solicitantesUpdate = `
      UPDATE red_colegio
      SET 
        dbu = CASE 
          ${Object.entries(cantidadSolicitantes).map(([key, count]) => {
            const [id_colegio, id_red] = key.split('-');
            return `WHEN id_colegio = ${id_colegio} AND id_red = ${id_red} THEN dbu - ${count}`;
        }).join(' ')}
          ELSE dbu
        END
      WHERE (${Object.entries(cantidadSolicitantes).map(([key]) => {
            const [id_colegio, id_red] = key.split('-');
            return `(id_colegio = ${id_colegio} AND id_red = ${id_red})`;
        }).join(' OR ')})
    `;
        await database_1.default.query(solicitantesUpdate, { transaction });
    }
    // 🚀 Luego actualizar BSP (oferentes)
    if (Object.keys(cantidadOferentes).length > 0) {
        const oferentesUpdate = `
      UPDATE red_colegio
      SET 
        bsp = CASE 
          ${Object.entries(cantidadOferentes).map(([key, count]) => {
            const [id_colegio, id_red] = key.split('-');
            return `WHEN id_colegio = ${id_colegio} AND id_red = ${id_red} THEN bsp - ${count}`;
        }).join(' ')}
          ELSE bsp
        END
      WHERE (${Object.entries(cantidadOferentes).map(([key]) => {
            const [id_colegio, id_red] = key.split('-');
            return `(id_colegio = ${id_colegio} AND id_red = ${id_red})`;
        }).join(' OR ')})
    `;
        await database_1.default.query(oferentesUpdate, { transaction });
    }
    // 🚀 Actualizar dbd (disponibles solicitantes)
    if (Object.keys(cantidadSolicitantes).length > 0) {
        await database_1.default.query(`
      UPDATE red_colegio
      SET dbd = db - dbu
      WHERE ${Object.entries(cantidadSolicitantes).map(([key]) => {
            const [id_colegio, id_red] = key.split('-');
            return `(id_colegio = ${id_colegio} AND id_red = ${id_red})`;
        }).join(' OR ')}
    `, { transaction });
    }
    // 🚀 Actualizar bde (disponibles oferentes)
    if (Object.keys(cantidadOferentes).length > 0) {
        await database_1.default.query(`
      UPDATE red_colegio
      SET bde = btp - bsa - bsp
      WHERE ${Object.entries(cantidadOferentes).map(([key]) => {
            const [id_colegio, id_red] = key.split('-');
            return `(id_colegio = ${id_colegio} AND id_red = ${id_red})`;
        }).join(' OR ')}
    `, { transaction });
    }
}
async function actualizarRedColegiosBajaSQL(becasDadasDeBaja, transaction) {
    const cantidadSolicitantes = becasDadasDeBaja.reduce((acc, beca) => {
        const key = `${beca.id_colegio_solic}-${beca.id_beca_beca.id_red}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    const cantidadOferentes = becasDadasDeBaja.reduce((acc, beca) => {
        const key = `${beca.id_beca_beca.id_colegio}-${beca.id_beca_beca.id_red}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    // 🟠 1. Decrementar DBU (solicitantes = quien tomó la beca)
    if (Object.keys(cantidadSolicitantes).length > 0) {
        const updateSolicitantes = `
      UPDATE red_colegio
      SET 
        dbu = CASE
          ${Object.entries(cantidadSolicitantes).map(([key, count]) => {
            const [id_colegio, id_red] = key.split('-');
            return `WHEN id_colegio = ${id_colegio} AND id_red = ${id_red} THEN dbu - ${count}`;
        }).join(' ')}
          ELSE dbu
        END
      WHERE ${Object.entries(cantidadSolicitantes).map(([key]) => {
            const [id_colegio, id_red] = key.split('-');
            return `(id_colegio = ${id_colegio} AND id_red = ${id_red})`;
        }).join(' OR ')}
    `;
        await database_1.default.query(updateSolicitantes, { transaction });
        // Después recalcular dbd
        await database_1.default.query(`
      UPDATE red_colegio
      SET dbd = db - dbu
      WHERE ${Object.entries(cantidadSolicitantes).map(([key]) => {
            const [id_colegio, id_red] = key.split('-');
            return `(id_colegio = ${id_colegio} AND id_red = ${id_red})`;
        }).join(' OR ')}
    `, { transaction });
    }
    // 🔵 2. Decrementar BSA (oferentes = quien ofreció la beca)
    if (Object.keys(cantidadOferentes).length > 0) {
        const updateOferentes = `
      UPDATE red_colegio
      SET 
        bsa = CASE
          ${Object.entries(cantidadOferentes).map(([key, count]) => {
            const [id_colegio, id_red] = key.split('-');
            return `WHEN id_colegio = ${id_colegio} AND id_red = ${id_red} THEN bsa - ${count}`;
        }).join(' ')}
          ELSE bsa
        END
      WHERE ${Object.entries(cantidadOferentes).map(([key]) => {
            const [id_colegio, id_red] = key.split('-');
            return `(id_colegio = ${id_colegio} AND id_red = ${id_red})`;
        }).join(' OR ')}
    `;
        await database_1.default.query(updateOferentes, { transaction });
        // Después recalcular bde
        await database_1.default.query(`
      UPDATE red_colegio
      SET bde = btp - bsa - bsp
      WHERE ${Object.entries(cantidadOferentes).map(([key]) => {
            const [id_colegio, id_red] = key.split('-');
            return `(id_colegio = ${id_colegio} AND id_red = ${id_red})`;
        }).join(' OR ')}
    `, { transaction });
    }
}
async function registrarEjecucionAutomatizacion(tipo, estado, total_procesadas, error = null, transaction // 👈 opcional, si querés pasar una transaction
) {
    const ejecucion = await beca_automatizacion_ejecucion_1.beca_automatizacion_ejecucion.create({
        tipo,
        estado,
        total_procesadas,
        error: error ? error : ''
    }, transaction ? { transaction } : {}); // Solo pasa {transaction} si existe
    return ejecucion; // 👈 retornamos
}
async function obtenerParametro(clave) {
    const parametro = await parametros_1.parametros.findOne({ where: { clave }, raw: true });
    return parametro?.valor || null;
}
///////////////////////////////////  
//// Tareas programadas /////
/////// Todos los dias a las 00:01
node_cron_1.default.schedule('1 0 * * *', async () => {
    await ejecutarBajaAutomaticaSiCorresponde(),
        await ejecutarNotificacionPorVencerSiCorresponde();
    await ejecutarNotificacionVencidaSiCorresponde();
}, {
    timezone: "America/Argentina/Buenos_Aires"
});
/////// Todos los dias a las 18:00PM
node_cron_1.default.schedule('0 6 * * *', async () => {
    await ejecutarNotificacionPorVencerSiCorresponde();
    await ejecutarNotificacionVencidaSiCorresponde();
}, {
    timezone: "America/Argentina/Buenos_Aires"
});
/////// Todos los dias a las 12:00PM
node_cron_1.default.schedule('0 12 * * *', async () => {
    await ejecutarNotificacionPorVencerSiCorresponde();
    await ejecutarNotificacionVencidaSiCorresponde();
}, {
    timezone: "America/Argentina/Buenos_Aires"
});
/////// Todos los dias a las 18:00PM
node_cron_1.default.schedule('0 18 * * *', async () => {
    await ejecutarNotificacionPorVencerSiCorresponde();
    await ejecutarNotificacionVencidaSiCorresponde();
}, {
    timezone: "America/Argentina/Buenos_Aires"
});
async function ejecutarBajaAutomaticaSiCorresponde() {
    try {
        console.log("🔍 [CRON] Validando si hoy se debe ejecutar la baja automática...");
        const config = await parametros_1.parametros.findOne({ where: { clave: 'fecha_baja_autom' } });
        if (!config || !config.valor) {
            console.log("⚠️ No se encontró la fecha de baja automática en parámetros.");
            return;
        }
        const hoy = new Date();
        const dia = String(hoy.getDate()).padStart(2, '0');
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const fechaHoy = `${dia}/${mes}`;
        if (fechaHoy !== config.valor) {
            console.log(`📅 Hoy es ${fechaHoy}, y la baja está programada para ${config.valor}. No se ejecuta.`);
            return;
        }
        console.log("✅ Fecha coincide. Ejecutando baja automática...");
        await procesarBecasDadaBaja();
    }
    catch (error) {
        console.error("❌ Error al validar fecha de ejecución automática:", error);
    }
}
async function ejecutarNotificacionPorVencerSiCorresponde() {
    try {
        await notificarBecasPorVencer();
    }
    catch (error) {
        console.error("❌ Error en ejecución automática de notificación por vencer:", error);
    }
}
async function ejecutarNotificacionVencidaSiCorresponde() {
    try {
        await notificarBecasVencidas();
    }
    catch (error) {
        console.error("❌ Error en ejecución automática de notificación por vencer:", error);
    }
}

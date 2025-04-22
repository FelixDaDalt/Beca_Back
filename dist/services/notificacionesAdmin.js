"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerNotificacionesAdmin = void 0;
const tareas_1 = require("../tareas/tareas");
const beca_solicitud_1 = require("../models/beca_solicitud");
const sequelize_1 = require("sequelize");
const obtenerNotificacionesAdmin = async () => {
    try {
        const diasVenc = Number(await (0, tareas_1.obtenerParametro)('dias_venc')) || 0;
        const diasNotifVenc = Number(await (0, tareas_1.obtenerParametro)('dias_notif_venc')) || 0;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (diasVenc && diasNotifVenc) {
            const [porVencer, vencidas, pendienteBaja] = await Promise.all([
                // Becas próximas a vencer
                beca_solicitud_1.beca_solicitud.count({
                    where: {
                        id_estado: 0,
                        notificarPorVencer: 0,
                        [sequelize_1.Op.and]: [
                            sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('DATE', sequelize_1.Sequelize.literal(`DATE_ADD(DATE_ADD(fecha_hora, INTERVAL ${diasVenc} DAY), INTERVAL -${diasNotifVenc} DAY)`)), { [sequelize_1.Op.lte]: hoy })
                        ]
                    },
                }),
                // Becas ya vencidas (no notificadas todavía)
                beca_solicitud_1.beca_solicitud.count({
                    where: {
                        id_estado: 0,
                        notificarVencida: 0,
                        [sequelize_1.Op.and]: [
                            sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('DATE_ADD', sequelize_1.Sequelize.col('fecha_hora'), sequelize_1.Sequelize.literal(`INTERVAL ${diasVenc} DAY`)), { [sequelize_1.Op.lt]: hoy })
                        ]
                    },
                }),
                // Becas que pidieron baja (estado = 3)
                beca_solicitud_1.beca_solicitud.count({
                    where: {
                        id_estado: 3
                    }
                })
            ]);
            return {
                total: porVencer + vencidas + pendienteBaja,
                becas: {
                    porVencer,
                    vencidas,
                    pendienteBaja
                },
                proximo: {
                    proxima: calcularProximaEjecucion(),
                    proximaPendiente: `Faltan ${await diasHastaProximaBaja()} días para la ejecución.`
                }
            };
        }
    }
    catch (error) {
        console.error("❌ Error al obtener notificaciones admin:", error);
        throw error;
    }
};
exports.obtenerNotificacionesAdmin = obtenerNotificacionesAdmin;
function calcularProximaEjecucion() {
    const ahora = new Date();
    const horarios = [
        { h: 0, m: 1 },
        { h: 6, m: 0 },
        { h: 12, m: 0 },
        { h: 18, m: 0 }
    ];
    // Buscar la próxima ejecución
    let proxima = null;
    for (const horario of horarios) {
        const posible = new Date();
        posible.setHours(horario.h, horario.m, 0, 0);
        if (ahora < posible) {
            proxima = posible;
            break;
        }
    }
    // Si ya pasaron todas hoy, usar la de mañana a las 00:01
    if (!proxima) {
        proxima = new Date();
        proxima.setDate(proxima.getDate() + 1);
        proxima.setHours(0, 1, 0, 0);
    }
    // Calcular diferencia
    const msFaltantes = proxima.getTime() - ahora.getTime();
    const minutosTotales = Math.floor(msFaltantes / 60000);
    const horas = Math.floor(minutosTotales / 60);
    const minutos = minutosTotales % 60;
    return `Próxima ejecución en ${horas}h ${minutos}min (${proxima.toLocaleTimeString()})`;
}
async function diasHastaProximaBaja() {
    const fechaParam = await (0, tareas_1.obtenerParametro)('fecha_baja_autom'); // debería ser tipo "02/11"
    if (!fechaParam) {
        throw new Error('❌ No se encontró el parámetro "fecha_baja_autom" en la base de datos.');
    }
    const [diaStr, mesStr] = fechaParam.split('/');
    const dia = parseInt(diaStr, 10);
    const mes = parseInt(mesStr, 10) - 1;
    const ahora = new Date();
    const anioActual = ahora.getFullYear();
    // 📅 Fecha objetivo
    let proxima = new Date(anioActual, mes, dia, 23, 59, 0, 0);
    // Si ya pasó este año, pasamos al siguiente
    if (proxima <= ahora) {
        proxima = new Date(anioActual + 1, mes, dia, 23, 59, 0, 0);
    }
    const diffMs = proxima.getTime() - ahora.getTime();
    const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return dias;
}

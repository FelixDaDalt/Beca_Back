"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const beca_1 = require("../models/beca");
const database_1 = __importDefault(require("../config/database"));
const beca_solicitud_1 = require("../models/beca_solicitud");
const node_cron_1 = __importDefault(require("node-cron"));
const sequelize_1 = require("sequelize");
const colegio_1 = require("../models/colegio");
const red_colegio_1 = require("../models/red_colegio");
const email_service_1 = require("../services/email.service");
const diasVencimiento = 2;
const diasNotificar = 1;
// Programar la tarea para que se ejecute todos los días a las 00:00
node_cron_1.default.schedule('0 */6 * * *', async () => {
    console.log('⏳ Ejecutando tarea programada');
    await verificarVencimientos();
    await notificarBecasPorVencer();
}, {
    timezone: "America/Argentina/Buenos_Aires" // Ajusta según tu zona horaria
});
async function verificarVencimientos() {
    try {
        console.log("🔎 Verificando becas vencidas...");
        // 1️⃣ Obtener becas vencidas (estado = 0 y más de 60 segundos de antigüedad)
        const becasVencidas = await beca_solicitud_1.beca_solicitud.findAll({
            where: {
                id_estado: 0,
                fecha_hora: {
                    [sequelize_1.Op.lte]: new Date(Date.now() - diasVencimiento * 24 * 60 * 60 * 1000),
                },
            },
            include: [
                {
                    model: beca_1.beca,
                    as: "id_beca_beca",
                    attributes: ["id_colegio"],
                },
            ],
        });
        if (becasVencidas.length === 0) {
            console.log("✅ No hay becas vencidas.");
            return;
        }
        console.log(`⏳ Procesando ${becasVencidas.length} becas vencidas...`);
        // 2️⃣ Obtener los IDs de colegios afectados
        const colegiosIds = [
            ...new Set(becasVencidas.flatMap((b) => [b.id_colegio_solic, b.id_beca_beca.id_colegio])),
        ];
        // 3️⃣ Obtener emails de los colegios
        const colegios = await colegio_1.colegio.findAll({
            where: {
                id: {
                    [sequelize_1.Op.in]: colegiosIds,
                },
            },
            attributes: ["id", "email", "nombre"],
        });
        const colegiosMap = colegios.reduce((acc, colegio) => {
            acc[colegio.id] = {
                email: colegio.email,
                nombre: colegio.nombre
            };
            return acc;
        }, {});
        // 4️⃣ Marcar becas como vencidas
        await beca_solicitud_1.beca_solicitud.update({ id_estado: 4, id_resolucion: 3, sinLeerSolicitante: 1, sinLeer: 1 }, {
            where: {
                id: becasVencidas.map((b) => b.id),
            },
        });
        console.log("✅ Becas actualizadas correctamente.");
        // 5️⃣ Actualizar `red_colegio`
        for (const beca of becasVencidas) {
            const { id_colegio_solic, id_beca_beca: { id_colegio: id_colegio_ofrecio } } = beca;
            // Colegio solicitante
            await red_colegio_1.red_colegio.update({
                dbu: database_1.default.literal("dbu - 1"),
                dbd: database_1.default.literal("db - dbu"),
            }, { where: { id_colegio: id_colegio_solic } });
            // Colegio que ofreció la beca
            await red_colegio_1.red_colegio.update({
                bsp: database_1.default.literal("bsp - 1"),
                bde: database_1.default.literal("btp - bsa - bsp"),
            }, { where: { id_colegio: id_colegio_ofrecio } });
        }
        console.log("✅ `red_colegio` actualizado correctamente.");
        // 6️⃣ Enviar correos de notificación
        for (const beca of becasVencidas) {
            const colegioSolicitante = colegiosMap[beca.id_colegio_solic];
            const colegioOfrecio = colegiosMap[beca.id_beca_beca.id_colegio];
            if (colegioSolicitante?.email) {
                try {
                    await (0, email_service_1.enviarCorreo)(colegioSolicitante.email, "📌 Beca Vencida", `La beca que solicitaste ha vencido.`, `<h1>Beca Vencida</h1><p>La beca solicitada a ${colegioOfrecio.nombre} ha vencido.</p>`);
                }
                catch (error) {
                    console.error(`⚠️ Error al enviar correo a ${colegioSolicitante.email}:`, error);
                }
            }
            if (colegioOfrecio?.email) {
                try {
                    await (0, email_service_1.enviarCorreo)(colegioOfrecio.email, "📌 Beca Vencida", `Una beca que te solicitaron ha vencido.`, `<h1>Beca Vencida</h1><p>Una beca solicitada por ${colegioSolicitante.nombre} ha vencido.</p>`);
                }
                catch (error) {
                    console.error(`⚠️ Error al enviar correo a ${colegioOfrecio.email}:`, error);
                }
            }
        }
        console.log("📨 Correos enviados correctamente.");
    }
    catch (error) {
        console.error("❌ Error en la verificación de vencimientos:", error);
    }
}
async function notificarBecasPorVencer() {
    try {
        console.log("🔎 Verificando becas por vencer...");
        // 1️⃣ Obtener becas por vencer (estado = 0 y faltan 2 minutos para vencer)
        const becasPorVencer = await beca_solicitud_1.beca_solicitud.findAll({
            where: {
                id_estado: 0, // Solo becas activas
                notificacionVencimiento: 0, // Solo becas que no han sido notificadas aún
                // Verifica si la fecha de vencimiento está dentro de 2 minutos desde ahora
                [sequelize_1.Op.and]: [
                    sequelize_1.Sequelize.literal(`NOW() >= DATE_ADD(beca_solicitud.fecha_hora, INTERVAL ${diasVencimiento - diasNotificar} DAY)`),
                    sequelize_1.Sequelize.literal(`NOW() <= DATE_ADD(beca_solicitud.fecha_hora, INTERVAL ${diasVencimiento - diasNotificar + 1} DAY)`)
                ]
            },
            include: [
                {
                    model: beca_1.beca,
                    as: "id_beca_beca",
                    attributes: ["id_colegio"],
                },
            ],
        });
        if (becasPorVencer.length === 0) {
            console.log("✅ No hay becas próximas a vencer.");
            return;
        }
        console.log(`⏳ Procesando ${becasPorVencer.length} becas próximas a vencer...`);
        // 2️⃣ Obtener los IDs de colegios afectados
        const colegiosIds = [
            ...new Set(becasPorVencer.flatMap((b) => [b.id_colegio_solic, b.id_beca_beca.id_colegio])),
        ];
        // 3️⃣ Obtener emails de los colegios
        const colegios = await colegio_1.colegio.findAll({
            where: {
                id: {
                    [sequelize_1.Op.in]: colegiosIds,
                },
            },
            attributes: ["id", "email", "nombre"],
        });
        const colegiosMap = colegios.reduce((acc, colegio) => {
            acc[colegio.id] = {
                email: colegio.email,
                nombre: colegio.nombre
            };
            return acc;
        }, {});
        // 4️⃣ Enviar correos de notificación
        for (const beca of becasPorVencer) {
            const colegioSolicitante = colegiosMap[beca.id_colegio_solic];
            const colegioOfrecio = colegiosMap[beca.id_beca_beca.id_colegio];
            if (colegioSolicitante?.email) {
                try {
                    await (0, email_service_1.enviarCorreo)(colegioSolicitante.email, "⏰ Beca por Vencer", `La beca que solicitaste está por vencer.`, `<h1>Beca por Vencer</h1><p>La beca solicitada a ${colegioOfrecio.nombre} está por vencer.</p>`);
                }
                catch (error) {
                    console.error(`⚠️ Error al enviar correo a ${colegioSolicitante.email}:`, error);
                }
            }
            if (colegioOfrecio?.email) {
                try {
                    await (0, email_service_1.enviarCorreo)(colegioOfrecio.email, "⏰ Beca por Vencer", `Una beca que te solicitaron está por vencer.`, `<h1>Beca por Vencer</h1><p>Una beca solicitada por ${colegioSolicitante.nombre} está por vencer.</p>`);
                }
                catch (error) {
                    console.error(`⚠️ Error al enviar correo a ${colegioOfrecio.email}:`, error);
                }
            }
            // 5️⃣ Marcar las becas como notificadas
            await beca_solicitud_1.beca_solicitud.update({ notificacionVencimiento: 1 }, {
                where: {
                    id: beca.id, // Actualizar solo la beca procesada
                },
            });
        }
        console.log("📨 Correos enviados correctamente.");
    }
    catch (error) {
        console.error("❌ Error en la verificación de becas por vencer:", error);
    }
}

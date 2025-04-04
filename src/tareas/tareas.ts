import { beca } from '../models/beca';
import sequelize from '../config/database';
import { beca_solicitud } from '../models/beca_solicitud';
import cron from 'node-cron';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { colegio } from '../models/colegio';
import { red_colegio } from '../models/red_colegio';
import { enviarCorreo } from '../services/email.service';
import { beca_automatizacion_log } from '../models/beca_automatizacion_log';
import { notificaciones } from '../models/notificaciones';


const diasVencimiento = 2;
const diasNotificar = 1;

const minutosVencimiento = 5;
const minutosNotificar = 2;

// Programar la tarea cada 5 minutos
cron.schedule('*/1 * * * *', async () => {
    console.log('⏳ Ejecutando tarea programada');
    await notificarBecasVencidas();
    await notificarBecasPorVencer();
}, {
    timezone: "America/Argentina/Buenos_Aires" // Ajusta según tu zona horaria
});

async function notificarBecasVencidas() {
    const t = await sequelize.transaction();
    try {
        console.log("🔎 1-Verificando becas vencidas...");
        const becasVencidas = await beca_solicitud.findAll({
            where: {
                id_estado: 0,
                notificarVencida:0,
                fecha_hora: {
                    // [Op.lte]: new Date(Date.now() - diasVencimiento * 24 * 60 * 60 * 1000),
                    [Op.lte]: new Date(Date.now() - minutosVencimiento * 60 * 1000)
                },
            },
            include: [
                {
                    model: beca,
                    as: "id_beca_beca",
                    attributes: ["id_colegio"],
                },
            ],
            transaction: t
        });
        if (becasVencidas.length === 0) {
            console.log("✅ Exit - No hay becas vencidas.");
            await t.commit();
            return;
        }

        console.log(`⏳ 2- Procesando ${becasVencidas.length} becas vencidas...`);
        // Obtener los IDs de colegios afectados en una sola consulta
        const colegiosIds = [
            ...new Set(becasVencidas.flatMap((b) => [b.id_colegio_solic, b.id_beca_beca.id_colegio])),
        ];
        // Obtener emails de los colegios
        const colegios = await colegio.findAll({
            where: {
                id: {
                    [Op.in]: colegiosIds,
                },
            },
            attributes: ["id", "email", "nombre"],
            transaction: t
        });
        //Crear Map
        const colegiosMap = colegios.reduce((acc, colegio) => {
            acc[colegio.id] = {
                email: colegio.email,
                nombre: colegio.nombre
            };
            return acc;
        }, {} as Record<number, { email: string | undefined; nombre: string }>);
        console.log("✅ Procesamiento correcto.");

        console.log(`⏳ 3- Marcando becas como vencidas y notificar...`);
        // Marcar becas como vencidas
        await beca_solicitud.update(
            { id_estado: 4 },
            {
                where: { id: becasVencidas.map((b) => b.id) },
                transaction: t
            }
        );

        // NOTIFICAR
        await notificaciones.update(
          { vencida: 1,
            leido_ofer:0,
            leido_solic:0 
          },
          {
              where: { id_solicitud: becasVencidas.map((b) => b.id) },
              transaction: t
          }
        );
        console.log("✅ Marcadas correctamente.");

        console.log("⏳ 4 - Actualizando Red_Colegio..");
        // Actualizar `red_colegio` en paralelo
        const redUpdates = becasVencidas.map(async (beca) => {
            const { id_colegio_solic, id_beca_beca: { id_colegio } } = beca;

            // Colegio solicitante
            await red_colegio.update(
                {
                    dbu: sequelize.literal("dbu - 1"),
                    dbd: sequelize.literal("db - dbu"),
                },
                { where: { id_colegio: id_colegio_solic }, transaction: t }
            );

            // Colegio que ofreció la beca
            await red_colegio.update(
                {
                    bsp: sequelize.literal("bsp - 1"),
                    bde: sequelize.literal("btp - bsa - bsp"),
                },
                { where: { id_colegio: id_colegio }, transaction: t }
            );
        });
        // Esperar a que todos los updates se completen
        await Promise.all(redUpdates);
        console.log("✅ Red_colegio actualizadas correctamente.");

        console.log(`⏳ 5 - Registrando Log...`);
        // Registrar logs en masa
        const logs = becasVencidas.map((beca) => {
            const colegioSolicitante = colegiosMap[beca.id_colegio_solic];
            const colegioOfrecio = colegiosMap[beca.id_beca_beca.id_colegio];

            return {
                id_beca_solicitud: beca.id,
                id_estado_anterior: beca.id_estado,
                id_estado_nuevo: 4,
                tipo_notificacion: 'VENCIDA' as 'VENCIDA',
                email_colegio_solicitante: colegioSolicitante?.email,
                email_colegio_ofrecio: colegioOfrecio?.email,
                motivo: "Vencimiento automático",
            };
        });
        await beca_automatizacion_log.bulkCreate(logs, { transaction: t });
        console.log("✅ Log Registrado.");

        await t.commit();

        // console.log("⏳ 6 - Procesando Correos.");
        // // Función para enviar correo con timeout
        // const enviar = (email:any, asunto:any, mensaje:any) => {
        //     const timeout = new Promise((_, reject) =>
        //         setTimeout(() => reject(new Error('Timeout alcanzado para el envío de correo')), 15000) // 15 segundos de timeout
        //     );

        //     const enviar = enviarCorreo(
        //         email,
        //         asunto,
        //         mensaje,
        //         `<h1>${asunto}</h1><p>${mensaje}</p>`
        //     );

        //     return Promise.race([enviar, timeout]); // Cualquiera de las dos promesas que se resuelva primero, la otra será rechazada
        // };

        // // Enviar correos de notificación en paralelo
        // const correoPromises = becasVencidas.map(async (beca) => {
        //     const colegioSolicitante = colegiosMap[beca.id_colegio_solic];
        //     const colegioOfrecio = colegiosMap[beca.id_beca_beca.id_colegio];

        //     try {
        //         await Promise.all([
        //             enviar(colegioSolicitante?.email, "📌 Beca Vencida", `La beca que solicitaste ha vencido.`),
        //             enviar(colegioOfrecio?.email, "📌 Beca Vencida", `Una beca que te solicitaron ha vencido.`),
        //         ]);
        //     } catch (error) {
        //         console.error(`⚠️ Error al enviar correo:`, error);
        //     }
        // });

        // // Esperar a que todos los correos se envíen
        // await Promise.all(correoPromises);
        // console.log("📨 Correos enviados correctamente.");
  
        console.log("✅ Exit - Becas vencidas.");
    } catch (error) {
        await t.rollback();
        console.error("❌ Error en la verificación de vencimientos:", error);
    }
}

async function notificarBecasPorVencer() {
  const t = await sequelize.transaction();
  try {
    console.log("🔎 1- Verificando becas por vencer...");
    // 1️⃣ Obtener becas por vencer (estado = 0 y faltan 2 minutos para vencer)
    const becasPorVencer = await beca_solicitud.findAll({
      where: {
        id_estado: 0, // Solo becas activas
        notificarPorVencer: 0, // Solo becas que no han sido notificadas aún
        // Verifica si la fecha de vencimiento está dentro de 2 minutos desde ahora
        [Op.and]: [
          // Sequelize.literal(`NOW() >= DATE_ADD(beca_solicitud.fecha_hora, INTERVAL ${diasVencimiento - diasNotificar} DAY)`),
          // Sequelize.literal(`NOW() <= DATE_ADD(beca_solicitud.fecha_hora, INTERVAL ${diasVencimiento - diasNotificar + 1} DAY)`)
          Sequelize.literal(
            `NOW() >= DATE_ADD(beca_solicitud.fecha_hora, INTERVAL ${
              minutosVencimiento - minutosNotificar
            } MINUTE)`
          ),
          Sequelize.literal(
            `NOW() <= DATE_ADD(beca_solicitud.fecha_hora, INTERVAL ${
              minutosVencimiento - minutosNotificar + minutosNotificar
            } MINUTE)`
          ),
        ],
      },
      include: [
        {
          model: beca,
          as: "id_beca_beca",
          attributes: ["id_colegio"],
        },
      ],
      transaction: t,
    });

    if (becasPorVencer.length === 0) {
      console.log("✅ Exit - No hay becas próximas a vencer.");
      await t.commit();
      return;
    }

    console.log(`⏳ 2 - Procesando ${becasPorVencer.length} becas por vencer...`);
    // Obtener los IDs de colegios afectados
    const colegiosIds = [
      ...new Set(
        becasPorVencer.flatMap((b) => [
          b.id_colegio_solic,
          b.id_beca_beca.id_colegio,
        ])
      ),
    ];
    // Obtener emails de los colegios
    const colegios = await colegio.findAll({
      where: {
        id: {
          [Op.in]: colegiosIds,
        },
      },
      attributes: ["id", "email", "nombre"],
      transaction: t,
    });

    const colegiosMap = colegios.reduce((acc, colegio) => {
      acc[colegio.id] = {
        email: colegio.email,
        nombre: colegio.nombre,
      };
      return acc;
    }, {} as Record<number, { email: string | undefined; nombre: string }>);
    console.log("✅ Procesamiento correcto.");

    console.log(`⏳ 3 - Marcando becas por vencer y notificar`);
    await beca_solicitud.update(
      { notificarPorVencer: 1,sinLeerSolicitante: 1, sinLeer: 1 },
      {
        where: {
          id: becasPorVencer.map((b) => b.id),
        },
        transaction: t,
      }
    );

    await notificaciones.update(
      { porvencer: 1,
        leido_ofer:0,
        leido_solic:0 
      },
      {
          where: { id_solicitud: becasPorVencer.map((b) => b.id) },
          transaction: t
      }
    );
    console.log("✅ Marcadas correctamente");

    console.log(`⏳ 4 - Registrando Log`);
    // 6️⃣ Registrar en el Log
    const logs = becasPorVencer.map((beca) => {
      const colegioSolicitante = colegiosMap[beca.id_colegio_solic];
      const colegioOfrecio = colegiosMap[beca.id_beca_beca.id_colegio];

      return {
        id_beca_solicitud: beca.id,
        id_estado_anterior: beca.id_estado, // Estado antes del vencimiento
        id_estado_nuevo: beca.id_estado, // Estado "vencida"
        tipo_notificacion: "POR_VENCER" as "POR_VENCER",
        email_colegio_solicitante: colegioSolicitante?.email,
        email_colegio_ofrecio: colegioOfrecio?.email,
        motivo: "POR VENCER automático",
      };
    });
    await beca_automatizacion_log.bulkCreate(logs, { transaction: t });
    console.log("✅ Log registrado.");
    await t.commit();

    // console.log(`⏳ 5 - Procesando Correos`);
    // const enviar = (email:any, asunto:any, mensaje:any) => {
    //     const timeout = new Promise((_, reject) =>
    //         setTimeout(() => reject(new Error('Timeout alcanzado para el envío de correo')), 15000) // 15 segundos de timeout
    //     );

    //     const enviar = enviarCorreo(
    //         email,
    //         asunto,
    //         mensaje,
    //         `<h1>${asunto}</h1><p>${mensaje}</p>`
    //     );

    //     return Promise.race([enviar, timeout]); // Cualquiera de las dos promesas que se resuelva primero, la otra será rechazada
    // };
    // // Enviar correos de notificación en paralelo
    // const correoPromises = becasPorVencer.map(async (beca) => {
    //     const colegioSolicitante = colegiosMap[beca.id_colegio_solic];
    //     const colegioOfrecio = colegiosMap[beca.id_beca_beca.id_colegio];

    //     try {
    //         await Promise.all([
    //             enviar(colegioSolicitante?.email, "⏰ Beca por Vencer", `La beca solicitada a ${colegioOfrecio.nombre} está por vencer.`),
    //             enviar(colegioOfrecio?.email, "⏰ Beca por Vencer", `Una beca solicitada por ${colegioSolicitante.nombre} está por vencer.`),
    //         ]);
    //     } catch (error) {
    //         console.error(`⚠️ Error al enviar correo:`, error);
    //     }
    // });
    // // Esperar a que todos los correos se envíen
    // await Promise.all(correoPromises);
    // console.log("📨 Correos enviados correctamente");

    console.log("✅ Exit - Becas por vencer.");
  } catch (error) {
    await t.rollback();
    console.error("❌ Error en la verificación de becas por vencer:", error);
  }
}


cron.schedule("*/2 * * * *", async () => {
    const t = await sequelize.transaction();
  
    try {
        console.log("🔎 1-Verificando becas pendiente de baja...");
        // 1️⃣ Obtener becas en estado 3 (solicitadas para baja) con sus colegios
        const becasPendientes = await beca_solicitud.findAll({
            where: { id_estado: 3 },
            include: [
            { model: beca, as: "id_beca_beca", attributes: ["id_colegio"] },
            ],
            transaction: t,
        });
  
        if (becasPendientes.length === 0) {
            console.log("✅ No hay becas pendientes de baja.");
            await t.commit();
            return;
        }
  
        console.log(`⏳ 2-Procesando ${becasPendientes.length} becas pendiente de baja...`);
    
            const colegiosIds = [
                ...new Set(
                becasPendientes.flatMap((b) => [b.id_colegio_solic, b.id_beca_beca.id_colegio])
                ),
            ];
        
            const colegios = await colegio.findAll({
                where: { id: { [Op.in]: colegiosIds } },
                attributes: ["id", "email", "nombre"],
                transaction: t,
            });
        
            const colegiosMap = Object.fromEntries(
                colegios.map(({ id, email, nombre }) => [id, { email, nombre }])
            );

      console.log("⏳ 3-Actualizando a estado BAJA..");
      await beca_solicitud.update(
          { id_estado: 6 },
          { where: { id_estado: 3 }, 
          transaction: t }
      );
      console.log("✅ estado actualizado correctamente.");
  
      console.log("⏳ 4-Actualizando red_colegio.");
      await Promise.all(
        becasPendientes.flatMap(({ id_colegio_solic, id_beca_beca }) => [
          red_colegio.update(
            { dbu: sequelize.literal("dbu - 1"), dbd: sequelize.literal("db - dbu") },
            { where: { id_colegio: id_colegio_solic }, transaction: t }
          ),
          red_colegio.update(
            { bsa: sequelize.literal("bsa - 1"), bde: sequelize.literal("btp - bsa - bsp") },
            { where: { id_colegio: id_beca_beca.id_colegio }, transaction: t }
          ),
        ])
      );
      console.log("✅ `red_colegio` actualizado correctamente.");
  
      console.log(`⏳ 5 - Registrando Log...`);
      // 6️⃣ Registrar logs en un solo `bulkCreate`
      await beca_automatizacion_log.bulkCreate(
        becasPendientes.map(({ id, id_colegio_solic, id_beca_beca }) => ({
          id_beca_solicitud: id,
          id_estado_anterior: 3,
          id_estado_nuevo: 6,
          tipo_notificacion: 'BAJA' as 'BAJA',
          email_colegio_solicitante: colegiosMap[id_colegio_solic]?.email,
          email_colegio_ofrecio: colegiosMap[id_beca_beca.id_colegio]?.email,
          motivo: "Baja automática",
        })),
        { transaction: t }
      );
      console.log("✅ Log Registrado.");
      await t.commit();
  
      console.log(`⏳ 5 - Procesando Correos`);
      // 7️⃣ Enviar correos en paralelo
      const enviar = (email:any, asunto:any, mensaje:any) => {
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout alcanzado para el envío de correo')), 15000) // 15 segundos de timeout
        );

        const enviar = enviarCorreo(
            email,
            asunto,
            mensaje,
            `<h1>${asunto}</h1><p>${mensaje}</p>`
        );

        return Promise.race([enviar, timeout]); // Cualquiera de las dos promesas que se resuelva primero, la otra será rechazada
        };
        // Enviar correos de notificación en paralelo
        const correoPromises = becasPendientes.map(async (beca) => {
        const colegioSolicitante = colegiosMap[beca.id_colegio_solic];
        const colegioOfrecio = colegiosMap[beca.id_beca_beca.id_colegio];

        try {
            await Promise.all([
                enviar(colegioSolicitante?.email, "📌 Beca Dada de Baja", `La beca solicitada a ${colegioOfrecio?.nombre} ha sido dada de baja.`),
                enviar(colegioOfrecio?.email, "📌 Beca Dada de Baja", `Una beca solicitada por ${colegioSolicitante?.nombre} ha sido dada de baja.`),
            ]);
        } catch (error) {
            console.error(`⚠️ Error al enviar correo:`, error);
        }
        });
        // Esperar a que todos los correos se envíen
        await Promise.all(correoPromises);
        console.log("📨 Correos enviados correctamente.");
        
        console.log("✅ Exit - Becas solicitadas de baja.");
    } catch (error) {
      await t.rollback();
      console.error("❌ Error en la actualización de becas dadas de baja:", error);
    }
  });
  

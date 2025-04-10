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
import { beca_automatizacion_ejecucion } from '../models/beca_automatizacion_ejecucion';


const diasVencimiento = 2;
const diasNotificar = 1;

const minutosVencimiento = Number(process.env.MINUTOS_VENCIMIENTO);
const minutosNotificar = Number(process.env.MINUTOS_NOTIFICAR);

// BECAS VENCIDAS Y POR VENCER
// cron.schedule('*/1 * * * *', async () => {
//     console.log('⏳ Ejecutando tarea programada');
//     await notificarBecasVencidas();
//     await notificarBecasPorVencer();
// }, {
//     timezone: "America/Argentina/Buenos_Aires" // Ajusta según tu zona horaria
// });

// 🎯 Becas Vencidas
export async function notificarBecasVencidas() {
  console.log("🔎 1 - Verificando becas vencidas...");

  // 🚀 LECTURA SIN transacción
  const becasVencidas = await beca_solicitud.findAll({
    where: {
      id_estado: 0,
      notificarVencida: 0,
      fecha_hora: {
        [Op.lte]: new Date(Date.now() - minutosVencimiento * 60 * 1000)
      }
    },
    include: [{ model: beca, as: "id_beca_beca", attributes: ["id_colegio"] }]
  });

  if (becasVencidas.length === 0) {
    console.log("✅ Exit - No hay becas vencidas.");
    const ejecucion = await registrarEjecucionAutomatizacion('VENCIDA', 'EXITO',becasVencidas.length, null);
    return {
      id:ejecucion.id,
      becasProcesadas: 0,
      colegiosInvolucrados: []
    };
  }

  const colegiosIds = [
    ...new Set(becasVencidas.flatMap(b => [b.id_colegio_solic, b.id_beca_beca.id_colegio]))
  ];

  const colegios = await colegio.findAll({
    where: { id: { [Op.in]: colegiosIds } },
    attributes: ["id", "email", "nombre"]
  });

  const colegiosMap = colegios.reduce((acc, colegio) => {
    acc[colegio.id] = { email: colegio.email, nombre: colegio.nombre };
    return acc;
  }, {} as Record<number, { email: string | undefined; nombre: string }>);

  console.log("✅ Becas y colegios leídos correctamente.");

  // 🚀 ESCRITURA CON transacción
  const t = await sequelize.transaction();
  let ejecucion: any = null;

  try {
    console.log("⏳ 2 - Registrando inicio de ejecución...");

    // 👇 Crear registro de ejecución
    ejecucion = await registrarEjecucionAutomatizacion('VENCIDA', 'EXITO',becasVencidas.length, null, t);

    console.log("✅ Registro de ejecución creado:", ejecucion.id);

    console.log("⏳ 3 - Actualizando estados y red_colegio...");

    await beca_solicitud.update(
      { id_estado: 4 },
      { where: { id: becasVencidas.map(b => b.id) }, transaction: t }
    );

    await notificaciones.update(
      { vencida: 1, leido_ofer: 0, leido_solic: 0 },
      { where: { id_solicitud: becasVencidas.map(b => b.id) }, transaction: t }
    );

    await actualizarRedColegiosSQL(becasVencidas, t);

    console.log("⏳ 4 - Registrando logs de becas...");

    const logs = becasVencidas.map(beca => ({
      id_beca_solicitud: beca.id,
      id_estado_anterior: 0,
      id_estado_nuevo: 4,
      tipo_notificacion: 'VENCIDA' as 'VENCIDA',
      email_colegio_solicitante: colegiosMap[beca.id_colegio_solic]?.email,
      email_colegio_ofrecio: colegiosMap[beca.id_beca_beca.id_colegio]?.email,
      motivo: "Vencimiento automático",
      id_ejecucion: ejecucion.id // 👈 Guardar el id de esta ejecución
    }));

    await beca_automatizacion_log.bulkCreate(logs, { transaction: t });

    await t.commit();
    console.log("✅ Becas vencidas procesadas correctamente.");

    // 🚀 RESPUESTA
    return {
      id:ejecucion.id,
      becasProcesadas: becasVencidas.length,
      colegiosInvolucrados: becasVencidas.map(beca => ({
        beca: beca.id,
        colegioSolicitante: colegiosMap[beca.id_colegio_solic]?.nombre || 'Desconocido',
        colegioOfrecio: colegiosMap[beca.id_beca_beca.id_colegio]?.nombre || 'Desconocido'
      }))
    };

  } catch (error:any) {
    console.error("❌ Error al procesar becas vencidas:", error);

    await t.rollback();

    // 👇 Crear registro de ejecución fallida
    ejecucion = await registrarEjecucionAutomatizacion('VENCIDA', 'ERROR',becasVencidas.length, null, t);

    throw error;
  }
}



// 🎯 Becas Por Vencer
export async function notificarBecasPorVencer() {
    console.log("🔎 1 - Verificando becas por vencer...");
  
    const becasPorVencer = await beca_solicitud.findAll({
      where: {
        id_estado: 0,
        notificarPorVencer: 0,
        [Op.and]: [
          Sequelize.literal(`NOW() >= DATE_ADD(beca_solicitud.fecha_hora, INTERVAL ${minutosVencimiento - minutosNotificar} MINUTE)`),
          Sequelize.literal(`NOW() <= DATE_ADD(beca_solicitud.fecha_hora, INTERVAL ${minutosVencimiento - minutosNotificar + minutosNotificar} MINUTE)`)
        ]
      },
      include: [{ model: beca, as: "id_beca_beca", attributes: ["id_colegio"] }]
    });
  
    if (becasPorVencer.length === 0) {
      console.log("✅ Exit - No hay becas próximas a vencer.");
      const ejecucion = await registrarEjecucionAutomatizacion('POR_VENCER', 'EXITO', becasPorVencer.length);
      return {
        id:ejecucion.id,
        becasProcesadas: 0,
        colegiosInvolucrados: []
      };
    }
  
    const colegiosIds = [
      ...new Set(becasPorVencer.flatMap(b => [b.id_colegio_solic, b.id_beca_beca.id_colegio]))
    ];
  
    const colegios = await colegio.findAll({
      where: { id: { [Op.in]: colegiosIds } },
      attributes: ["id", "email", "nombre"]
    });
  
    const colegiosMap = colegios.reduce((acc, colegio) => {
      acc[colegio.id] = { email: colegio.email, nombre: colegio.nombre };
      return acc;
    }, {} as Record<number, { email: string | undefined; nombre: string }>);
  
    console.log("✅ Becas y colegios leídos correctamente.");
  
    // 🚀 INICIO de transacción
    const t = await sequelize.transaction();
    let ejecucion: any = null;
  
    try {
      console.log("⏳ 2 - Registrando inicio de ejecución...");
  
      // 👇 Crear registro de ejecución
      ejecucion = await registrarEjecucionAutomatizacion('POR_VENCER', 'EXITO',becasPorVencer.length, null, t);
  
      console.log("✅ Registro de ejecución creado:", ejecucion.id);
  
      console.log("⏳ 3 - Actualizando estado de notificaciones...");
  
      await beca_solicitud.update(
        { notificarPorVencer: 1, sinLeerSolicitante: 1, sinLeer: 1 },
        { where: { id: becasPorVencer.map(b => b.id) }, transaction: t }
      );
  
      await notificaciones.update(
        { porvencer: 1, leido_ofer: 0, leido_solic: 0 },
        { where: { id_solicitud: becasPorVencer.map(b => b.id) }, transaction: t }
      );
  
      console.log("⏳ 4 - Registrando logs de cada beca...");
  
      const logs = becasPorVencer.map(beca => ({
        id_beca_solicitud: beca.id,
        id_estado_anterior: 0,
        id_estado_nuevo: 0,
        tipo_notificacion: 'POR_VENCER' as 'POR_VENCER',
        email_colegio_solicitante: colegiosMap[beca.id_colegio_solic]?.email,
        email_colegio_ofrecio: colegiosMap[beca.id_beca_beca.id_colegio]?.email,
        motivo: "POR VENCER automático",
        id_ejecucion: ejecucion.id // 👈 Enlazar cada log con la ejecución
      }));
  
      await beca_automatizacion_log.bulkCreate(logs, { transaction: t });
  
      await t.commit();
      console.log("✅ Becas por vencer procesadas correctamente.");
  
      return {
        id:ejecucion.id,
        becasProcesadas: becasPorVencer.length,
        colegiosInvolucrados: becasPorVencer.map(beca => ({
          beca: beca.id,
          colegioSolicitante: colegiosMap[beca.id_colegio_solic]?.nombre || 'Desconocido',
          colegioOfrecio: colegiosMap[beca.id_beca_beca.id_colegio]?.nombre || 'Desconocido'
        }))
      };
  
    } catch (error:any) {
      console.error("❌ Error al procesar becas por vencer:", error);
  
      await t.rollback();
  
      // 👇 Crear registro de ejecución fallida
       await registrarEjecucionAutomatizacion('POR_VENCER', 'ERROR',0, error.message);
  
      throw error;
    }
}
/////////////////////////////////



// BECAS DADA DE BAJAS, CADA UN AÑO
  // "0 0 1 11 *" 1 de noviembre de cada año
  
// cron.schedule("*/2 * * * *", async () => {
//     await procesarBecasDadaBaja()
//   },{
//     timezone: "America/Argentina/Buenos_Aires" // Ajusta según tu zona horaria
// });

export async function procesarBecasDadaBaja() {
  console.log("🔎 1 - Verificando becas pendientes de baja...");

  // 🚀 LECTURA SIN transacción
  const becasPendientes = await beca_solicitud.findAll({
    where: { id_estado: 3 },
    include: [{ model: beca, as: "id_beca_beca", attributes: ["id_colegio"] }],
  });

  if (becasPendientes.length === 0) {
    console.log("✅ No hay becas pendientes de baja.");
    const ejecucion = await registrarEjecucionAutomatizacion('BAJA', 'EXITO', becasPendientes.length);
    return {id:ejecucion.id, becasProcesadas: 0, colegiosInvolucrados: [] };
  }

  console.log(`⏳ 2 - Procesando ${becasPendientes.length} becas...`);

  const colegiosIds = [
    ...new Set(
      becasPendientes.flatMap(b => [b.id_colegio_solic, b.id_beca_beca.id_colegio])
    ),
  ];

  const colegios = await colegio.findAll({
    where: { id: { [Op.in]: colegiosIds } },
    attributes: ["id", "email", "nombre"],
  });

  const colegiosMap = colegios.reduce((acc, colegio) => {
    acc[colegio.id] = { email: colegio.email, nombre: colegio.nombre };
    return acc;
  }, {} as Record<number, { email: string | undefined; nombre: string }>);

  // 🚀 ESCRITURA CON transacción
  const t = await sequelize.transaction();
  let ejecucion: any = null;

  try {
    console.log("⏳ 3 - Registrando inicio de ejecución...");

    // 👇 Crear registro de ejecución
    ejecucion = await registrarEjecucionAutomatizacion('BAJA', 'EXITO',becasPendientes.length, null, t);

    console.log("✅ Registro de ejecución creado:", ejecucion.id);

    console.log("⏳ 4 - Actualizando estados y red_colegio...");

    await beca_solicitud.update(
      { id_estado: 6 },
      { where: { id_estado: 3 }, transaction: t }
    );

    await actualizarRedColegiosSQL(becasPendientes, t);

    console.log("⏳ 5 - Registrando logs...");

    await beca_automatizacion_log.bulkCreate(
      becasPendientes.map(({ id, id_colegio_solic, id_beca_beca }) => ({
        id_beca_solicitud: id,
        id_estado_anterior: 3,
        id_estado_nuevo: 6,
        tipo_notificacion: 'BAJA' as 'BAJA',
        email_colegio_solicitante: colegiosMap[id_colegio_solic]?.email,
        email_colegio_ofrecio: colegiosMap[id_beca_beca.id_colegio]?.email,
        motivo: "Baja automática",
        id_ejecucion: ejecucion.id // 👈 Relacionar cada log con esta ejecución
      })),
      { transaction: t }
    );

    await t.commit();
    console.log("✅ Base de datos actualizada correctamente.");

    console.log(`⏳ 6 - Enviando correos...`);

    const enviar = (email: any, asunto: any, mensaje: any) => {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout alcanzado para el envío de correo')), 15000)
      );

      const enviar = enviarCorreo(
        email,
        asunto,
        mensaje,
        `<h1>${asunto}</h1><p>${mensaje}</p>`
      );

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
      } catch (error) {
        console.error(`⚠️ Error al enviar correo:`, error);
      }
    });

    await Promise.all(correoPromises);
    console.log("📨 Correos enviados correctamente.");
    console.log("✅ Exit - Becas procesadas.");

    return {
      id:ejecucion.id,
      becasProcesadas: becasPendientes.length,
      colegiosInvolucrados: becasPendientes.map(beca => ({
        beca: beca.id,
        colegioSolicitante: colegiosMap[beca.id_colegio_solic]?.nombre || 'Desconocido',
        colegioOfrecio: colegiosMap[beca.id_beca_beca.id_colegio]?.nombre || 'Desconocido'
      }))
    };

  } catch (error:any) {
    console.error("❌ Error al procesar becas dadas de baja:", error);

    await t.rollback();

    // 👇 Crear registro de ejecución fallida
    await registrarEjecucionAutomatizacion('BAJA', 'ERROR',0, error.message);  

    throw error;
  }
}


export async function actualizarRedColegiosSQL(becasPendientes: any[], transaction: any) {
  const cantidadSolicitantes = becasPendientes.reduce((acc, beca) => {
    acc[beca.id_colegio_solic] = (acc[beca.id_colegio_solic] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const cantidadOferentes = becasPendientes.reduce((acc, beca) => {
    acc[beca.id_beca_beca.id_colegio] = (acc[beca.id_beca_beca.id_colegio] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // 🚀 Actualizar solicitantes (se liberan becas solicitadas)
  if (Object.keys(cantidadSolicitantes).length > 0) {
    const solicitantesUpdate = `
      UPDATE red_colegio
      SET 
        dbu = CASE id_colegio 
          ${Object.entries(cantidadSolicitantes).map(([id, count]) => `WHEN ${id} THEN dbu - ${count}`).join(' ')}
          ELSE dbu
        END,
        dbd = CASE id_colegio 
          ${Object.entries(cantidadSolicitantes).map(([id, count]) => `WHEN ${id} THEN db - (dbu - ${count})`).join(' ')}
          ELSE (db - dbu)
        END
      WHERE id_colegio IN (${Object.keys(cantidadSolicitantes).join(',')})
    `;

    await sequelize.query(solicitantesUpdate, { transaction });
  }

  // 🚀 Actualizar oferentes (se liberan becas ofertadas)
  if (Object.keys(cantidadOferentes).length > 0) {
    const oferentesUpdate = `
      UPDATE red_colegio
      SET 
        bsa = CASE id_colegio 
          ${Object.entries(cantidadOferentes).map(([id, count]) => `WHEN ${id} THEN bsa - ${count}`).join(' ')}
          ELSE bsa
        END,
        bde = CASE id_colegio 
          ${Object.entries(cantidadOferentes).map(([id, count]) => `WHEN ${id} THEN (btp - (bsa - ${count}) - bsp)`).join(' ')}
          ELSE (btp - bsa - bsp)
        END
      WHERE id_colegio IN (${Object.keys(cantidadOferentes).join(',')})
    `;

    await sequelize.query(oferentesUpdate, { transaction });
  }
}

///////////////////////////////////  

async function registrarEjecucionAutomatizacion(
  tipo: 'BAJA' | 'VENCIDA' | 'POR_VENCER',
  estado: 'EXITO' | 'ERROR',
  total_procesadas: number,
  error: string | null = null,
  transaction?: any // 👈 opcional, si querés pasar una transaction
) {
  const ejecucion = await beca_automatizacion_ejecucion.create({
    tipo,
    estado,
    total_procesadas,
    error:error?error:''
  }, transaction ? { transaction } : {}); // Solo pasa {transaction} si existe

  return ejecucion; // 👈 retornamos
}
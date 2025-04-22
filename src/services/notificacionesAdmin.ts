
import { obtenerParametro } from '../tareas/tareas';
import { beca_solicitud } from '../models/beca_solicitud';
import { Op, Sequelize } from 'sequelize';

const obtenerNotificacionesAdmin = async () => {
  try {
    const diasVenc = Number(await obtenerParametro('dias_venc')) || 0;
    const diasNotifVenc = Number(await obtenerParametro('dias_notif_venc')) || 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 


    if(diasVenc && diasNotifVenc){
        const [porVencer, vencidas, pendienteBaja] = await Promise.all([
        // Becas próximas a vencer
        beca_solicitud.count({
          where: {
            id_estado: 0,
            notificarPorVencer: 0,
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn(
                  'DATE',
                  Sequelize.literal(`DATE_ADD(DATE_ADD(fecha_hora, INTERVAL ${diasVenc} DAY), INTERVAL -${diasNotifVenc} DAY)`)
                ),
                { [Op.lte]: hoy }
              )
            ]
          },
        }),

        // Becas ya vencidas (no notificadas todavía)
        beca_solicitud.count({
            where: {
              id_estado: 0,
              notificarVencida: 0,
              [Op.and]: [
                Sequelize.where(
                  Sequelize.fn(
                    'DATE_ADD',
                    Sequelize.col('fecha_hora'),
                    Sequelize.literal(`INTERVAL ${diasVenc} DAY`)
                  ),
                  { [Op.lt]: hoy } 
                )
              ]
            },
        }),
        // Becas que pidieron baja (estado = 3)
        beca_solicitud.count({
            where: {
            id_estado: 3
            }
        })
        ]);
    
        return {
        total:porVencer+vencidas+pendienteBaja,    
        becas: {
            porVencer,
            vencidas,
            pendienteBaja
        },
        proximo:{
          proxima:calcularProximaEjecucion(),
          proximaPendiente:`Faltan ${await diasHastaProximaBaja()} días para la próxima ejecución de baja.`
        }
        };
    }

  } catch (error) {
    console.error("❌ Error al obtener notificaciones admin:", error);
    throw error;
  }
};

function calcularProximaEjecucion(): string {
  const ahora = new Date();

  // Crear hoy a las 00:01
  const hoy001 = new Date();
  hoy001.setHours(0, 1, 0, 0);

  // Crear hoy a las 12:00
  const hoy1200 = new Date();
  hoy1200.setHours(12, 0, 0, 0);

  let proxima: Date;

  if (ahora < hoy001) {
    proxima = hoy001;
  } else if (ahora < hoy1200) {
    proxima = hoy1200;
  } else {
    // Mañana a las 00:01
    proxima = new Date();
    proxima.setDate(proxima.getDate() + 1);
    proxima.setHours(0, 1, 0, 0);
  }

  // Calcular diferencia
  const msFaltantes = proxima.getTime() - ahora.getTime();
  const minutosTotales = Math.floor(msFaltantes / 60000);
  const horas = Math.floor(minutosTotales / 60);
  const minutos = minutosTotales % 60;

  return `Próxima ejecución en ${horas}h ${minutos}min`;
}


async function diasHastaProximaBaja(): Promise<number> {
    const fechaParam = await obtenerParametro('fecha_baja_autom'); // debería ser tipo "02/11"
  
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

export {obtenerNotificacionesAdmin}

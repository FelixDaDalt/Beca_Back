
import { beca_solicitud } from '../models/beca_solicitud';
import { Op, Sequelize } from 'sequelize';

const obtenerNotificacionesAdmin = async () => {
  try {
    if(process.env.MINUTOS_VENCIMIENTO){
        const [porVencer, vencidas, pendienteBaja] = await Promise.all([
        // Becas próximas a vencer
        beca_solicitud.count({
            where: {
            id_estado: 0,
            notificarPorVencer: 0,
            [Op.and]: [
                Sequelize.literal(`NOW() >= DATE_ADD(beca_solicitud.fecha_hora, INTERVAL ${Number(process.env.MINUTOS_VENCIMIENTO) - Number(process.env.MINUTOS_NOTIFICAR)} MINUTE)`),
                Sequelize.literal(`NOW() <= DATE_ADD(beca_solicitud.fecha_hora, INTERVAL ${Number(process.env.MINUTOS_VENCIMIENTO)} MINUTE)`)
              ]
            }
        }),
        // Becas ya vencidas (no notificadas todavía)
        beca_solicitud.count({
            where: {
            id_estado: 0,
            notificarVencida: 0,
            fecha_hora: {
                [Op.lte]: new Date(Date.now() - Number(process.env.MINUTOS_VENCIMIENTO) * 60 * 1000)
            }
            }
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
        }
        };
    }

  } catch (error) {
    console.error("❌ Error al obtener notificaciones admin:", error);
    throw error;
  }
};

export {obtenerNotificacionesAdmin}

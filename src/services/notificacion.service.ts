
import { beca } from "../models/beca";
import { Op, Transaction } from "sequelize";
import { beca_solicitud } from "../models/beca_solicitud";
import { colegio } from "../models/colegio";
import { notificaciones } from "../models/notificaciones";


const obtenerNotificaciones = async (
  idUsuario: string, 
  idRol: number, 
  idColegio: string, 
  transaction: Transaction
) => {
  try {
    // Si el rol es 0, no tiene notificaciones
    if (idRol === 0) {
      return {
        solicitudesSinLeer: 0,
        misSolicitudesSinLeer: 0,
        total: 0,
        solicitudes: [],
        misSolicitudes: []
      };
    }

    // 🚀 Consultar notificaciones donde el colegio sea oferente o solicitante
    let notificacionesDB = await notificaciones.findAll({
      where: {
        [Op.or]: [
          { id_colegio_ofer: idColegio, leido_ofer: 0 }, // Notificaciones de solicitudes
          { id_colegio_solic: idColegio, leido_solic: 0 } // Notificaciones de mis solicitudes
        ]
      },
      transaction,
      include:[{
        model:beca_solicitud,
        as:'id_solicitud_beca_solicitud',
        include:[{
            model:beca,
            as:'id_beca_beca'
        }]
      },{
        model:colegio,
        as:'id_colegio_ofer_colegio'
      },
      {
        model:colegio,
        as:'id_colegio_solic_colegio'
      }]
    });

    // 🔄 Mapear solicitudes
    const solicitudesMapeadas = notificacionesDB
      .filter(n => n.id_colegio_ofer === Number(idColegio))
      .map(n => ({
        id: n.id_solicitud,
        colegio: n.id_colegio_solic_colegio.nombre,
        foto: n.id_colegio_solic_colegio.foto,
        id_red: n.id_solicitud_beca_solicitud.id_beca_beca.id_red,

        vencida: n.vencida,
        porVencer: n.porvencer,
        desestimado: n.desestimada,
        porBaja: n.porbaja,
        dadaDeBaja: n.dadabaja,
        fecha: n.fecha  
      }));

    // 🔄 Mapear mis solicitudes
    const misSolicitudesMapeadas = notificacionesDB
      .filter(n => n.id_colegio_solic === Number(idColegio))
      .map(n => ({
        id: n.id_solicitud,
        colegio: n.id_colegio_ofer_colegio.nombre,
        foto: n.id_colegio_ofer_colegio.foto,
        id_red: n.id_solicitud_beca_solicitud.id_beca_beca.id_red,

        vencida: n.vencida,
        porVencer: n.porvencer,
        desestimado: n.desestimada,
        porBaja: n.porbaja,
        dadaDeBaja: n.dadabaja,
        fecha: n.fecha      
      }));

    // 📌 Estructura final de la respuesta
    return {
      solicitudesSinLeer: solicitudesMapeadas.length,
      misSolicitudesSinLeer: misSolicitudesMapeadas.length,
      total: solicitudesMapeadas.length + misSolicitudesMapeadas.length,
      solicitudes: solicitudesMapeadas,
      misSolicitudes: misSolicitudesMapeadas
    };
  } catch (error) {
    console.error("⚠️ Error en obtenerNotificaciones:", error);
    throw error;
  }
};



export{obtenerNotificaciones }
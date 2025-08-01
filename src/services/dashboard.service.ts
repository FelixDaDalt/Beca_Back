
import { colegio } from '../models/colegio';
import { beca_solicitud } from '../models/beca_solicitud';
import { Op, Sequelize } from 'sequelize';
import { red } from '../models/red';
import { beca } from '../models/beca';
import sequelize from '../config/database';
import { beca_estado } from '../models/beca_estado';
import { beca_resolucion } from '../models/beca_resolucion';
import { red_colegio } from '../models/red_colegio';


const obtenerResumenDashboard = async () => {
  try {
    // 🏫 Total colegios
    const totalColegios = await colegio.count({ where: { borrado: 0 } });

    // 🟢 Colegios activos
    const colegiosActivos = await colegio.count({ where: { suspendido: 0, borrado: 0 } });

    // 🔴 Colegios inactivos
    const colegiosInactivos = await colegio.count({ where: { suspendido: 1, borrado: 0 } });

    // 🛡️ Total redes
    const totalRedes = await red.count({ where: { borrado: 0 } });

    // 📚 Total solicitudes disponibles
    const totalSolicitudesDisponiblesResult = await red_colegio.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('bde')), 'totalDisponibles']],
      where: { borrado: 0 },
      raw: true
    }) as { totalDisponibles: number } | null;

    const totalSolicitudesDisponibles = totalSolicitudesDisponiblesResult?.totalDisponibles || 0;

    // 📚 Total becas publicadas (sumando "cantidad")
    const totalBecasResult = await beca.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('cantidad')), 'totalCantidad']],
      where: { borrado: 0 },
      raw: true
    }) as { totalCantidad: number } | null;

    const becasPublicadas = totalBecasResult?.totalCantidad || 0;

    // total de solicitudes por becas
    const totalSolicitudesPorBecaDisponiblesResult = await red_colegio.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('btp')), 'totalDisponibles']],
      where: { borrado: 0 },
      raw: true
    }) as { totalDisponibles: number } | null;

    const totalSolicitudesPorBeca = totalSolicitudesPorBecaDisponiblesResult?.totalDisponibles || 0;
    
    // 📋 Total solicitudes de becas
    const totalSolicitudes = await beca_solicitud.count();

    // 📋 Cantidad de becas por estado
    const estados = [0, 1, 2, 3, 4, 5, 6];
    const becasPorEstado: { [key: number]: number } = {};

    for (const estado of estados) {
      const cantidad = await beca_solicitud.count({ where: { id_estado: estado } });
      becasPorEstado[estado] = cantidad;
    }

    // 📈 Porcentajes
    const porcentajeColegiosActivos = totalColegios > 0 ? (colegiosActivos / totalColegios) * 100 : 0;
    const promedioBecasPorColegio = totalColegios > 0 ? (becasPublicadas / totalColegios) : 0;
    const tasaAprobacion = totalSolicitudes > 0 ? (becasPorEstado[5] / totalSolicitudes) * 100 : 0; // Estado 5 = Aprobada
    const promedioSolicitudesPorBeca = becasPublicadas > 0 ? (totalSolicitudesPorBeca / becasPublicadas) : 0;

    // 📈 Ocupación de becas
    const becasOcupadas = totalSolicitudesPorBeca - totalSolicitudesDisponibles;
const porcentajeOcupadas = totalSolicitudesPorBeca > 0
  ? (becasOcupadas / totalSolicitudesPorBeca) * 100
  : 0;
const porcentajeDisponibles = totalSolicitudesPorBeca > 0
  ? (totalSolicitudesDisponibles / totalSolicitudesPorBeca) * 100
  : 0;

    // 🕒 Últimas solicitudes recientes
    const ultimasSolicitudes = await beca_solicitud.findAll({
      limit: 5,
      order: [['fecha_hora', 'DESC']],
      attributes: ['id', 'alumno_nombre', 'alumno_apellido', 'alumno_dni', 'fecha_hora'],
      include: [
        {
          model: beca,
          as: 'id_beca_beca',
          attributes: ['id'],
          include: [{
            model: colegio,
            as: 'id_colegio_colegio',
            attributes: ['id', 'nombre']
          }]
        },
        {
          model: colegio,
          as: 'id_colegio_solic_colegio',
          attributes: ['id', 'nombre']
        },
        {
          model: beca_estado,
          as: 'id_estado_beca_estado',
          attributes: ['nombre', 'id']
        },
        {
          model: beca_resolucion,
          as: 'id_resolucion_beca_resolucion',
          attributes: ['nombre', 'id']
        }
      ],
      raw: true,
      nest: true
    });

    const ultimasSolicitudesMapeadas = ultimasSolicitudes.map(solicitud => ({
      idBeca: solicitud.id_beca_beca.id,
      alumnoNombre: solicitud.alumno_nombre,
      alumnoApellido: solicitud.alumno_apellido,
      alumnoDni: solicitud.alumno_dni,
      fechaHora: solicitud.fecha_hora,
      estado: {
        id: solicitud.id_estado_beca_estado.id,
        nombre: solicitud.id_estado_beca_estado.nombre
      },
      resolucion: {
        id: solicitud.id_resolucion_beca_resolucion.id,
        nombre: solicitud.id_resolucion_beca_resolucion.nombre
      },
      colegioPublico: {
        id: solicitud.id_beca_beca.id_colegio_colegio.id,
        nombre: solicitud.id_beca_beca.id_colegio_colegio.nombre
      },
      colegioSolicito: {
        id: solicitud.id_colegio_solic_colegio.id,
        nombre: solicitud.id_colegio_solic_colegio.nombre
      }
    }));

    // 📋 Cards directamente armadas
    const cards = [
      {
        titulo: 'Colegios',
        valor: totalColegios,
        subtitulo: `Activos: ${colegiosActivos} (${porcentajeColegiosActivos.toFixed(2)}%)`,
        color: 'primary'
      },
      {
        titulo: 'Redes',
        valor: totalRedes,
        subtitulo: 'Total de redes',
        color: 'success'
      },
      {
        titulo: 'Becas Publicadas',
        valor: becasPublicadas,
        subtitulo: `Total de becas ofrecidas.<br><small>Promedio por colegio: <b>${promedioBecasPorColegio.toFixed(2)}</b></small>`,
        color: 'warning'
      },
      {
        titulo: 'Solicitudes por Beca',
        valor: totalSolicitudesPorBeca,
        subtitulo: `Solicitudes posibles.<br><small>Promedio por beca publicada: <b>${promedioSolicitudesPorBeca.toFixed(2)}</b></small>`,
        color: 'warning'
      },
      {
        titulo: 'Solicitudes Realizadas',
        valor: totalSolicitudes,
        subtitulo: `Solicitudes recibidas.<br><small>Promedio de aceptación: <b>${tasaAprobacion.toFixed(2)}%</b></small>`,
        color: 'info'
      },
      {
        titulo: 'Solicitudes Disponibles',
        valor: totalSolicitudesDisponibles,
        subtitulo: `Solicitudes aún disponibles.<br><small>Porcentaje disponible: <b>${porcentajeDisponibles.toFixed(2)}%</b></small>`,
        color: 'secondary'
      }
    ];

    // 📦 Estructura de respuesta
    const respuesta = {
      resumen: {
        colegios: totalColegios,
        colegiosActivos: colegiosActivos,
        colegiosInactivos: colegiosInactivos,
        porcentajeColegiosActivos: porcentajeColegiosActivos.toFixed(2),
        redes: totalRedes,
        becasPublicadas: becasPublicadas,
        promedioBecasPorColegio: promedioBecasPorColegio.toFixed(2),
        totalSolicitudes: totalSolicitudes,
        tasaAprobacion: tasaAprobacion.toFixed(2),
        solicitudesDisponibles: totalSolicitudesDisponibles
      },
      ocupacion: {
        becasOcupadas,
        becasDisponibles: totalSolicitudesPorBeca,
        porcentajeOcupadas: porcentajeOcupadas.toFixed(2),
        porcentajeDisponibles: porcentajeDisponibles.toFixed(2)
      },
      cards: cards,
      becasPorEstado: becasPorEstado,
      ultimasSolicitudes: ultimasSolicitudesMapeadas
    };

    return respuesta;

  } catch (error) {
    throw error;
  }
};


export {obtenerResumenDashboard}

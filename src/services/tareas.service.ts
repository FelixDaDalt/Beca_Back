import { Op, Transaction } from "sequelize";
import { plan } from "../models/plan";
import { beca_automatizacion_ejecucion } from "../models/beca_automatizacion_ejecucion";
import { beca_automatizacion_log } from "../models/beca_automatizacion_log";


interface FiltroEjecucion {
    page?: number;
    pageSize?: number;
    fechaDesde?: string; // formato ISO: '2025-04-08'
    fechaHasta?: string;
    tipos?: string[];     // ['BAJA', 'VENCIDA', 'POR_VENCER']
  }
  
 const obtenerEjecuciones = async (filtro: FiltroEjecucion = {}) => {
    try {
      const { page = 1, pageSize = 10, fechaDesde, fechaHasta, tipos } = filtro;
  
      const where: any = {};
  
      // 🎯 Filtro de fecha (usando "fecha" en lugar de "createdAt")
      if (fechaDesde || fechaHasta) {
        where.fecha = {};
        if (fechaDesde) {
          where.fecha[Op.gte] = new Date(fechaDesde + 'T00:00:00');
        }
        if (fechaHasta) {
          where.fecha[Op.lte] = new Date(fechaHasta + 'T23:59:59');
        }
      }
  
      // 🎯 Filtro de tipos
      if (tipos && tipos.length > 0) {
        where.tipo = tipos;
      }
  
      const ejecucionesEncontradas = await beca_automatizacion_ejecucion.findAndCountAll({
        where,
        include:[{
            model:beca_automatizacion_log,
            as:'beca_automatizacion_logs',
            required:false
        }],
        order: [['fecha', 'DESC']], // 🔥 Ordenado por fecha (más nueva primero)
        limit: pageSize,
        offset: (page - 1) * pageSize
      });
  
      return {
        total: ejecucionesEncontradas.count,
        paginas: Math.ceil(ejecucionesEncontradas.count / pageSize),
        paginaActual: page,
        data: ejecucionesEncontradas.rows
      };
  
    } catch (error) {
      throw error;
    }
  };




export{obtenerEjecuciones}
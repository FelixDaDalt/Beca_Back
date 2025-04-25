import { usuario } from "../models/usuario";
import { Op, Transaction } from "sequelize";
import { reporte_error } from "../models/reporte_error";
import { colegio } from "../models/colegio";

interface FiltroEjecucion {
    page?: number;
    pageSize?: number;
    fechaDesde?: string; // formato ISO: '2025-04-08'
    fechaHasta?: string;
  }


const nuevoReporte = async (idUsuario:number, nuevoReporte: reporte_error,transaction:Transaction) => {
    try {
        // 1. Verificar si el usuario existe por DNI
        const usuarioExistente = await usuario.findOne({
            where: {
                id:idUsuario,
                borrado: 0
            },
            transaction, 
        });

  
        if (!usuarioExistente) {
            const error = new Error('No se proporciono un usuario valido');
            (error as any).statusCode = 400; 
            throw error;
        }


        // 3. Agregar el colegio
        nuevoReporte.id_usuario = idUsuario
 
        const agregarReporte = await reporte_error.create(nuevoReporte, { transaction }); // Incluye la transacción

        return agregarReporte   
        
    } catch (error) {

        throw error;
    }
};

const listadoReportes = async (filtro: FiltroEjecucion = {}) => {
    try {
      const { page = 1, pageSize = 10, fechaDesde, fechaHasta } = filtro;
  
      const where: any = {};
  
      // 🎯 Filtro de fecha (más preciso)
      if (fechaDesde || fechaHasta) {
        where.fecha = {};
  
        if (fechaDesde) {
          where.fecha[Op.gte] = new Date(fechaDesde + 'T00:00:00');
        }
  
        if (fechaHasta) {
          where.fecha[Op.lte] = new Date(fechaHasta + 'T23:59:59');
        }
      }
  
      const reportesEncontrados = await reporte_error.findAndCountAll({
        where,
        include:[{
            model: usuario,
            as: 'id_usuario_usuario',
            required: false,
            attributes: ['email', 'nombre', 'apellido'],
            include: [{
                model: colegio,
                as: 'id_colegio_colegio',
                required: false,
                attributes: ['nombre'],
            }]
        }],
        order: [['fecha', 'DESC']],
        limit: pageSize,
        offset: (page - 1) * pageSize
      });
  
      return {
        total: reportesEncontrados.count,
        paginas: Math.ceil(reportesEncontrados.count / pageSize),
        paginaActual: page,
        data: reportesEncontrados.rows
      };
  
    } catch (error) {
      throw error;
    }
  };

const borrarReporte = async (idReporte:string,transaction:Transaction) => {
        
    try {

        const reporteExistente = await reporte_error.findOne({
            where:{
                id:idReporte,
                borrado:0
            }
        })

        if(!reporteExistente){
            const error = new Error('El Reporte no existe');
            (error as any).statusCode = 400; 
            throw error;
        }

        // Cambiar estado de suspensión
        reporteExistente.borrado = 1;
        
        // Guardar cambios
        await reporteExistente.save({ transaction });

        // 4. Retornar
        return reporteExistente

    } catch (error) {
        throw error;
    }
};



export{nuevoReporte,listadoReportes, borrarReporte }
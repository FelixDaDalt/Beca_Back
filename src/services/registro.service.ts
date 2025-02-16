import { usuario } from './../models/usuario';
import { Op, Sequelize, Transaction } from 'sequelize';
import { actividad_log } from '../models/actividad_log';
import { administrador } from '../models/administrador';


const registrosPorColegio = async (idColegio:string, idRol:number)=>{
    try {
        // Obtener los registros relacionados con el colegio
        const registros = await actividad_log.findAll({
            where: {
                id_colegio: idColegio,
                id_rol: {
                    [Op.gte]: Number(idRol), // idRol debe ser >= al proporcionado
                },
            },
            include:[{
                model:administrador,
                as: 'admin',
                required: false, // Para que no filtre registros sin administrador
                attributes: ['id', 'nombre', 'apellido'], // Solo los campos que necesitas
            },{
                model:usuario,
                as:'usuario',
                required: false, // Para que no filtre registros sin administrador
                attributes: ['id', 'nombre', 'apellido'], // Solo los campos que necesitas
            }],
            order: [['fecha', 'DESC']], // Ordenar por fecha descendente
        });

        const agrupadosPorRol = registros.reduce((acumulador: any, registro: any) => {
            const rolKey = obtenerRol(registro.id_rol).toLowerCase(); // Clave basada en id_rol

            if (!acumulador[rolKey]) {
                acumulador[rolKey] = [];
            }

            acumulador[rolKey].push({
                id: registro.id,
                realizadoPor: registro.usuario_id ?? registro.admin_id, // Determina quién realizó la acción
                descripcion: registro.descripcion,
                fechaHora: registro.fecha,
                ip: registro.ip,
                navegador: registro.navegador,
                accion: registro.accion,
                administrador:registro.admin,
                usuario:registro.usuario
            });

            return acumulador;
        }, {});

        // Responder con los datos organizados
        return agrupadosPorRol
    }catch (error: any) {
        throw new Error('Error al obtener los registros: ' + error.message);
    }
}

const registrosAdmin = async ()=>{
    try {
        // Obtener los registros relacionados con el colegio
        const registros = await actividad_log.findAll({
            where: {
                id_rol: 0
            },
            include: [
                {
                    model: administrador, // Asegúrate de importar el modelo de Administrador
                    as: 'admin',
                    required: false, // Para que no filtre registros sin administrador
                    attributes: ['id', 'nombre', 'apellido'], // Solo los campos que necesitas
                }
            ],
            order: [['fecha', 'DESC']], // Ordenar por fecha descendente
        });

        const agrupadosPorRol = registros.reduce((acumulador: any, registro: any) => {
            const rolKey = obtenerRol(registro.id_rol).toLowerCase(); // Clave basada en id_rol

            if (!acumulador[rolKey]) {
                acumulador[rolKey] = [];
            }

            acumulador[rolKey].push({
                id: registro.id,
                realizadoPor: registro.usuario_id ?? registro.admin_id, // Determina quién realizó la acción
                descripcion: registro.descripcion,
                fechaHora: registro.fecha,
                ip: registro.ip,
                navegador: registro.navegador,
                accion: registro.accion,
                administrador:registro.admin
            });

            return acumulador;
        }, {});

        // Responder con los datos organizados
        return agrupadosPorRol
    }catch (error: any) {
        throw new Error('Error al obtener los registros: ' + error.message);
    }
}


const obtenerRol = (idRol: number): string => {
    switch (idRol) {
        case 0:
            return 'Administrador';
        case 1:
            return 'Responsable';
        case 2:
            return 'Delegado';
        case 3:
            return 'Autorizado';
        default:
            return 'Desconocido';
    }
};

export { registrosPorColegio,registrosAdmin };


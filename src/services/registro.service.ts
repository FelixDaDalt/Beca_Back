import { usuario } from '../models/usuario';
import { entidad_tipo } from '../models/entidad_tipo';
import { registroeventos } from '../models/registroeventos';
import { Op, Transaction } from 'sequelize';
import { colegio } from '../models/colegio';
import { red } from '../models/red';
import { administrador } from '../models/administrador';


const registrarEvento = async (
    idUsuario: number,                    // ID del usuario o administrador que realiza la acción
    idRol: number,                 // Rol del usuario que realiza la acción (0 para administrador, otro valor para usuario)
    entidadTipoId: number,         // ID del tipo de entidad (e.g., colegio, beca, etc.)
    entidadId: number,             // ID de la entidad específica
    accion: string,                // Acción realizada (e.g., 'Alta')
    descripcion: string,           // Descripción de la actividad realizada
    ip: string,
    navegador: string,
    transaction: Transaction,
    idColegio?:number, 
) => {
    try {

        const entidadTipo = await entidad_tipo.findOne({
            where: { id: entidadTipoId }
        });

        if (!entidadTipo) {
            throw new Error('Tipo de entidad no encontrado: ${entidadTipoId}');
        }

        const registroData = {
            entidad_tipo_id: entidadTipoId,
            entidad_id: entidadId,
            accion,
            descripcion,
            ip,
            navegador,
            fecha_hora: new Date(),
            usuario_id: idRol === 0 ? undefined : idUsuario,     // Si es rol de administrador, no asignamos `usuario_id`
            administrador_id: idRol === 0 ? idUsuario : undefined, // Si no es rol de administrador, no asignamos `administrador_id`
            id_rol:idRol,
            id_colegio:idColegio
        };

        // Crear el primer registro de actividad
        await registroeventos.create(registroData, { transaction });



    } catch (error: any) {
        throw new Error('Error al registrar el evento: ' + error.message);
    }
};

const registrosPorColegio = async (idColegio:string, idRol:number)=>{
    try {
        // Obtener los registros relacionados con el colegio
        const registros = await registroeventos.findAll({
            where: { 
                id_colegio: idColegio,
                id_rol: { [Op.gte]: idRol }
            },
            attributes: ['id', 'accion', 'descripcion', 'fecha_hora', 'ip', 'navegador', 'entidad_tipo_id', 'entidad_id', 'usuario_id', 'administrador_id', 'id_rol'],
        });

        const registrosConDetalles = await Promise.all(
            registros.map(async (registro) => {
                // Determinar el modelo a consultar según `entidad_tipo_id`
                let entidadDetalle = null;
                switch (registro.entidad_tipo_id) {
                    case 1: // Usuario
                        entidadDetalle = await usuario.findOne({
                            where: { id: registro.entidad_id },
                            attributes: ['nombre', 'apellido'],
                        });
                        break;
                    case 2: // Colegio
                        entidadDetalle = await colegio.findOne({
                            where: { id: registro.entidad_id },
                            attributes: ['nombre'],
                        });
                        break;
                    case 3: // Red
                        entidadDetalle = await red.findOne({
                            where: { id: registro.entidad_id },
                            attributes: ['nombre'],
                        });
                        break;
                }

                // Determinar quién realizó el movimiento
                const actor =
                    registro.usuario_id !== null
                        ? await usuario.findOne({
                              where: { id: registro.usuario_id },
                              attributes: ['nombre', 'apellido'],
                          })
                        : await administrador.findOne({
                              where: { id: registro.administrador_id },
                              attributes: ['nombre', 'apellido'],
                          });

                const actorNombre = actor ? `${actor.nombre} ${actor.apellido}` : 'Desconocido';
                const entidadNombre = entidadDetalle
                ? `${entidadDetalle.nombre}${'apellido' in entidadDetalle && entidadDetalle.apellido ? ' ' + entidadDetalle.apellido : ''}`
                : 'Entidad desconocida';

                return {
                    id: registro.id,
                    accion: registro.accion,
                    descripcion: registro.descripcion,
                    entidad: entidadNombre,
                    realizadoPor: actorNombre,
                    rol: obtenerRol(registro.id_rol),
                    fecha_hora: registro.fecha_hora,
                    ip: registro.ip,
                    navegador: registro.navegador,
                };
            })
        );

        // Agrupar por roles
        const agrupadosPorRol = registrosConDetalles.reduce((acumulador:any, registro:any) => {
            const rolKey = registro.rol.toLowerCase(); // "administrador", "responsable", etc.
            if (!acumulador[rolKey]) {
                acumulador[rolKey] = [];
            }
            acumulador[rolKey].push({
                id:registro.id,
                realizadoPor: registro.realizadoPor,
                descripcion: registro.descripcion,
                entidad: registro.entidad,
                fechaHora: registro.fecha_hora,
                ip: registro.ip,
                navegador: registro.navegador,
                accion: registro.accion,
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
        const registros = await registroeventos.findAll({
            where: { 
                id_rol: 0
            },
            attributes: ['id', 'accion', 'descripcion', 'fecha_hora', 'ip', 'navegador', 'entidad_tipo_id', 'entidad_id', 'usuario_id', 'administrador_id', 'id_rol'],
        });

        const registrosConDetalles = await Promise.all(
            registros.map(async (registro) => {
                // Determinar el modelo a consultar según `entidad_tipo_id`
                let entidadDetalle = null;
                switch (registro.entidad_tipo_id) {
                    case 1: // Usuario
                        entidadDetalle = await usuario.findOne({
                            where: { id: registro.entidad_id },
                            attributes: ['nombre', 'apellido'],
                        });
                        break;
                    case 2: // Colegio
                        entidadDetalle = await colegio.findOne({
                            where: { id: registro.entidad_id },
                            attributes: ['nombre'],
                        });
                        break;
                    case 3: // Red
                        entidadDetalle = await red.findOne({
                            where: { id: registro.entidad_id },
                            attributes: ['nombre'],
                        });
                        break;
                }

                // Determinar quién realizó el movimiento
                const actor = await administrador.findOne({
                              where: { id: registro.administrador_id },
                              attributes: ['nombre', 'apellido'],
                          });

                const actorNombre = actor ? `${actor.nombre} ${actor.apellido}` : 'Desconocido';
                const entidadNombre = entidadDetalle
                ? `${entidadDetalle.nombre}${'apellido' in entidadDetalle && entidadDetalle.apellido ? ' ' + entidadDetalle.apellido : ''}`
                : 'Entidad desconocida';

                return {
                    id: registro.id,
                    accion: registro.accion,
                    descripcion: registro.descripcion,
                    entidad: entidadNombre,
                    realizadoPor: actorNombre,
                    rol: obtenerRol(registro.id_rol),
                    fecha_hora: registro.fecha_hora,
                    ip: registro.ip,
                    navegador: registro.navegador,
                };
            })
        );

        // Agrupar por roles
        const agrupadosPorRol = registrosConDetalles.reduce((acumulador:any, registro:any) => {
            const rolKey = registro.rol.toLowerCase(); // "administrador", "responsable", etc.
            if (!acumulador[rolKey]) {
                acumulador[rolKey] = [];
            }
            acumulador[rolKey].push({
                id:registro.id,
                realizadoPor: registro.realizadoPor,
                descripcion: registro.descripcion,
                entidad: registro.entidad,
                fechaHora: registro.fecha_hora,
                ip: registro.ip,
                navegador: registro.navegador,
                accion: registro.accion,
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

export { registrarEvento,registrosPorColegio,registrosAdmin };


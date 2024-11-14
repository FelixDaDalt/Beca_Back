import { registro_responsable } from "../models/registro_responsable";
import { registro_administrador } from "../models/registro_administrador";
import { registro_delegado } from "../models/registro_delegado";
import { Model, ModelCtor, Op, Transaction } from "sequelize";
import sequelize from "../config/database";
import { usuario } from "../models/usuario";
import { registro_autorizado } from "../models/registro_autorizado";
import { administrador } from "../models/administrador";
import { registro_red } from "../models/registro_red";
import { registro_colegio } from "../models/registro_colegio";


const registrarActividad = async (
    idAdmin: number,
    idRol: number,
    descripcion: string,
    transaction:Transaction
) => {
    try {
        // Definir `table` como `ModelCtor<Model<any, any>>`
        let table: ModelCtor<Model<any, any>>;

        // Selección del modelo según el rol
        switch (idRol) {
            case 0:
                table = registro_administrador;
                break;
            case 1:
                table = registro_responsable;
                break;
            case 2:
                table = registro_delegado;
                break;
            case 3:
                table = registro_autorizado;
                break;
            default:
                throw new Error('Rol no válido');
        }

        // Crear el registro en la tabla seleccionada
        return await table.create(
            {
                id_usuario: idAdmin,
                fecha_hora: new Date(),
                registro: descripcion
            },{transaction}
        );
    } catch (error: any) {
        throw new Error('Error al registrar la actividad: ' + error.message);
    }
};

const listadoRegistros = async (id_colegio: string) => {
    const transaction = await sequelize.transaction();

    try {
        let registros: any = {
            delegado: null,
            responsable: null,
            autorizado:null
        };

        registros.responsable = await registro_responsable.findAll({
                    include: [{
                        model: usuario,
                        as: 'id_usuario_usuario',
                        attributes:{exclude:['password','borrado']},
                        where: { 
                            id_colegio,
                        }
                    }],
                    transaction
        });

        registros.delegado = await registro_delegado.findAll({
                    include: [{
                        model: usuario,
                        as: 'id_usuario_usuario',
                        attributes:{exclude:['password','borrado']},
                        where: { 
                            id_colegio,
                        }
                    }],
                    transaction
        });

        registros.autorizado = await registro_autorizado.findAll({
                    include: [{
                        model: usuario,
                        as: 'id_usuario_usuario',
                        attributes:{exclude:['password','borrado']},
                        where: { 
                            id_colegio,
                        }
                    }],
                    transaction
        });
        
        await transaction.commit();
        
        return {
            administrador: registros.administrador,
            responsable: registros.responsable,
            delegado: registros.delegado,
            autorizado: registros.autorizado
            };
        }

       
     catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const listadoRegistrosAdmin = async () => {
    const transaction = await sequelize.transaction();

    try {
        let registros: any = {
            administrador:null,
            delegado: null,
            responsable: null,
            autorizado:null
        };

        registros.administrador = await registro_administrador.findAll({
            include: [{
                model: administrador,
                as: 'id_usuario_administrador',
                attributes:{exclude:['password','borrado']},
            }],
            transaction
        });

        registros.responsable = await registro_responsable.findAll({
                    include: [{
                        model: usuario,
                        as: 'id_usuario_usuario',
                        attributes:{exclude:['password','borrado']},
                    }],
                    transaction
        });

        registros.delegado = await registro_delegado.findAll({
                    include: [{
                        model: usuario,
                        as: 'id_usuario_usuario',
                        attributes:{exclude:['password','borrado']},
                    }],
                    transaction
        });

        registros.autorizado = await registro_autorizado.findAll({
                    include: [{
                        model: usuario,
                        as: 'id_usuario_usuario',
                        attributes:{exclude:['password','borrado']},
                    }],
                    transaction
        });
        
        await transaction.commit();
        
        return {
            administrador: registros.administrador,
            responsable: registros.responsable,
            delegado: registros.delegado,
            autorizado: registros.autorizado
            };
        }
     catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const registrarActividadRed = async (
    idRed:number,
    idUsuario: number,
    idRol: number,
    descripcion: string,
    transaction:Transaction,
    comentario?:string
) => {
    try {
        await registro_red.create(
            {
                id_red:idRed,
                id_usuario: idRol>0?idUsuario:undefined,
                id_admi: idRol == 0?idUsuario:undefined,
                fecha_hora: new Date(),
                descripcion: descripcion,
                comentario:comentario?comentario:undefined
            },{transaction}
        );
    } catch (error: any) {
        throw new Error('Error al registrar la actividad de Red: ' + error.message);
    }
};

const registrarActividadColegio = async (
    idColegio: number,
    idUsuario: number,
    idRol: number,
    descripcion: string,
    transaction: Transaction,
    comentario?: string
) => {
    try {
        await registro_colegio.create(
            {
                id_colegio: idColegio,
                id_usuario: idRol > 0 ? idUsuario : undefined, 
                id_admi: idRol === 0 ? idUsuario : undefined, 
                fecha_hora: new Date(),
                descripcion: descripcion,
                comentario: comentario ? comentario : undefined  
            },
            { transaction } 
        );
    } catch (error: any) {
        throw new Error('Error al registrar la actividad de Red: ' + error.message);
    }
};


export {registrarActividad, listadoRegistros,listadoRegistrosAdmin,registrarActividadRed,registrarActividadColegio }


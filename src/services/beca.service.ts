import { Transaction } from "sequelize";
import { red_colegio } from "../models/red_colegio";
import { beca } from "../models/beca";
import { colegio } from "../models/colegio";
import { usuario } from "../models/usuario";

interface Beca {
    cantidad:number
}

const listadoBecas = async (idRed: string, idColegio:string, transaction: Transaction) => {
    try {
        const redColegio = await red_colegio.findOne({
            where: {
                id_colegio: idColegio,
                id_red: idRed,
                borrado: 0
            },
            transaction // Asegúrate de pasar la transacción
        });

        if (!redColegio) {
            const error = new Error('El colegio no pertenece a la Red');
            (error as any).statusCode = 400;
            throw error;
        }

        // Verifica red_colegio
        const listado = await beca.findAll({
            where: {
                id_red: idRed,
                borrado: 0
            },
            include:[{
                model:colegio,
                as:'id_colegio_colegio',
                required:true,
                attributes:{exclude:['borrado','suspendido','terminos']}
            },{
                model:usuario,
                as:'id_usuario_usuario',
                required:false,
                attributes:{exclude:['password','id_rol','id_colegio','cambiarPass','tyc','suspendido','borrado']}
            }],
            transaction // Asegúrate de pasar la transacción
        });

        return listado;
    } catch (error) {
        throw error;
    }
};

const altaBeca = async (altaBeca: Beca, idUsuario: string, idColegio: string, idRed: string, transaction: Transaction) => {
    try {
        // Verifica red_colegio
        const redColegio = await red_colegio.findOne({
            where: {
                id_colegio: idColegio,
                id_red: idRed,
                borrado: 0
            },
            transaction // Asegúrate de pasar la transacción
        });

        if (!redColegio) {
            const error = new Error('El colegio no pertenece a la Red');
            (error as any).statusCode = 400;
            throw error;
        }

        const becasUsadas = redColegio.dbu || 0;

        if (altaBeca.cantidad < becasUsadas) {
            const error = new Error('No se pueden ofrecer menos becas que las que se tienen tomadas y pendientes');
            (error as any).statusCode = 400;
            throw error;
        }

        // Verifica si existe la beca
        const becaActualizar = await beca.findOne({
            where: {
                id_red: redColegio.id_red,
                id_colegio: redColegio.id_colegio,
                borrado: 0
            },
            transaction // Pasa la transacción
        });

        if (!becaActualizar) {
            // Crear nueva beca
            const nuevaBeca = {
                id_red: Number(idRed),
                id_colegio: Number(idColegio),
                id_usuario: Number(idUsuario),
                cantidad: altaBeca.cantidad
            };

            const becaCreada = await beca.create(nuevaBeca, { transaction });
            await actualizarDatosRedColegio(redColegio, altaBeca, transaction);
            await redColegio.save({ transaction });
            return becaCreada;
        }

        // Actualizar beca existente
        becaActualizar.cantidad = altaBeca.cantidad;
        becaActualizar.fecha_hora = new Date();
        await becaActualizar.save({ transaction });

        await actualizarDatosRedColegio(redColegio, altaBeca, transaction);
        await redColegio.save({ transaction });

        return becaActualizar;
    } catch (error) {
        throw error;
    }
};

const actualizarDatosRedColegio = async (redColegio: any, altaBeca: Beca, transaction: Transaction) => {
    try {
        // Variables base
        const BO = altaBeca.cantidad; // Becas voluntarias
        const DBU = redColegio.dbu || 0; // Derecho a Becas Utilizadas
        const BS = redColegio.bs || 0; // Becas Propias Solicitadas
        const BU = redColegio.bu || 0; // Becas Propias Utilizadas

        // Cálculos
        const TBO = BO + 2; // Total de Becas a Otorgar
        const DB = BO; // Derecho a Becas
        const DBD = DB - DBU; // Derecho a Becas Disponibles
        const BD = TBO - BU - BS; // Becas Disponibles

        // Actualización en red_colegio
        redColegio.bp = BO; // Becas Publicadas
        redColegio.tbo = TBO; // Total de Becas a Otorgar
        redColegio.db = DB; // Derecho a Becas
        redColegio.dbd = DBD; // Derecho a Becas Disponibles
        redColegio.bd = BD; // Becas Disponibles

        // Guardar los cambios
        await redColegio.save({ transaction });

        return redColegio;
    } catch (error:any) {
        throw new Error(`Error al actualizar los datos en red_colegio: ${error.message}`);
    }
};



export{altaBeca,listadoBecas}
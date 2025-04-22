import { Transaction } from "sequelize";
import { parametros } from "../models/parametros";


const obtenerParametros = async () => {
    try {
        const parametrosEncontrados = await parametros.findAll({
            attributes: { exclude: ['clave'] },
        });
        return parametrosEncontrados;

    } catch (error) {
        throw error;
    }
};

const actualizarParametro = async (parametro:any, transaction:Transaction) => {
    try {
        // 1. Buscar la zona y verificar que no esté borrada
        const parametroEncontrado = await parametros.findOne({
            where: { id: parametro.id },
            transaction
        });

        if (!parametroEncontrado) {
            const error = new Error('Parametro no encontrado');
            (error as any).statusCode = 400;
            throw error;
        }

        // 2. Actualizar los datos de la zona
        await parametroEncontrado.update(parametro, {transaction});


        // 5. Retornar
        return parametroEncontrado

    } catch (error) {
        throw error;
    }
};




export{obtenerParametros,actualizarParametro}
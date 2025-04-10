import { Transaction } from "sequelize";
import { forma_pago } from "../models/forma_pago";


const obtenerPagos = async () => {
    try {
        const pagosEncontrados = await forma_pago.findAll({
            where: {
                borrado: 0
            },
            attributes: { exclude: ['borrado'] },
        });

        return pagosEncontrados;

    } catch (error) {
        throw error;
    }
};


const actualizarPagos = async (datosActualizados:forma_pago, transaction:Transaction) => {
    try {
        // 1. Buscar la plan y verificar que no esté borrada
        const pagoEncontrado = await forma_pago.findOne({
            where: { id: datosActualizados.id, borrado: 0 },
            transaction
        });

        if (!pagoEncontrado) {
            const error = new Error('La Forma de pago no existe');
            (error as any).statusCode = 400;
            throw error;
        }

        // 2. Actualizar los datos de la plan
        await pagoEncontrado.update(datosActualizados, {transaction});


        // 5. Retornar
        return pagoEncontrado

    } catch (error) {
        throw error;
    }
};


export{obtenerPagos,actualizarPagos}
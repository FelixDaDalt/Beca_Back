import { Transaction } from "sequelize";
import { plan } from "../models/plan";


const obtenerPlanes = async () => {
    try {
        const panesEncontrados = await plan.findAll({
            where: {
                borrado: 0
            },
            attributes: { exclude: ['borrado'] },
        });

        return panesEncontrados;

    } catch (error) {
        throw error;
    }
};

const nuevoPlan = async (planNuevo: plan, transaction:Transaction) => {
    try {
        
        // 1. Dar de alta los terminos
        const nuevoPlan = await plan.create(planNuevo, { transaction });

        // 4. Retornar
        return nuevoPlan

    } catch (error) {
        throw error;
    }
};

const borrarPlan= async (idPlan: string,transaction:Transaction) => {

    try {
        // 1. Buscar la plan y verificar si ya está borrada
        const planEncontrada = await plan.findOne({
            where: { id: idPlan, borrado: 0 },
            transaction
        });

        if (!planEncontrada) {
            const error = new Error('El Plan no existe o ya está borrado');
            (error as any).statusCode = 400;
            throw error;
        }

        // 2. Marcar la plan como borrada
        await planEncontrada.update({ borrado: 1 }, {transaction});

        // 5. Retornar
        return planEncontrada

    } catch (error) {
        throw error;
    }
};

const actualizarPlan = async (datosActualizados:plan, transaction:Transaction) => {
    try {
        // 1. Buscar la plan y verificar que no esté borrada
        const planEncontrada = await plan.findOne({
            where: { id: datosActualizados.id, borrado: 0 },
            transaction
        });

        if (!planEncontrada) {
            const error = new Error('El plan no existe o está borrado');
            (error as any).statusCode = 400;
            throw error;
        }

        // 2. Actualizar los datos de la plan
        await planEncontrada.update(datosActualizados, {transaction});


        // 5. Retornar
        return planEncontrada

    } catch (error) {
        throw error;
    }
};


export{obtenerPlanes,nuevoPlan,borrarPlan,actualizarPlan}
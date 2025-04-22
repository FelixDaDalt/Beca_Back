"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarPlan = exports.borrarPlan = exports.nuevoPlan = exports.obtenerPlanes = void 0;
const plan_1 = require("../models/plan");
const obtenerPlanes = async () => {
    try {
        const panesEncontrados = await plan_1.plan.findAll({
            where: {
                borrado: 0
            },
            attributes: { exclude: ['borrado'] },
        });
        return panesEncontrados;
    }
    catch (error) {
        throw error;
    }
};
exports.obtenerPlanes = obtenerPlanes;
const nuevoPlan = async (planNuevo, transaction) => {
    try {
        // 1. Dar de alta los terminos
        const nuevoPlan = await plan_1.plan.create(planNuevo, { transaction });
        // 4. Retornar
        return nuevoPlan;
    }
    catch (error) {
        throw error;
    }
};
exports.nuevoPlan = nuevoPlan;
const borrarPlan = async (idPlan, transaction) => {
    try {
        // 1. Buscar la plan y verificar si ya está borrada
        const planEncontrada = await plan_1.plan.findOne({
            where: { id: idPlan, borrado: 0 },
            transaction
        });
        if (!planEncontrada) {
            const error = new Error('El Plan no existe o ya está borrado');
            error.statusCode = 400;
            throw error;
        }
        // 2. Marcar la plan como borrada
        await planEncontrada.update({ borrado: 1 }, { transaction });
        // 5. Retornar
        return planEncontrada;
    }
    catch (error) {
        throw error;
    }
};
exports.borrarPlan = borrarPlan;
const actualizarPlan = async (datosActualizados, transaction) => {
    try {
        // 1. Buscar la plan y verificar que no esté borrada
        const planEncontrada = await plan_1.plan.findOne({
            where: { id: datosActualizados.id, borrado: 0 },
            transaction
        });
        if (!planEncontrada) {
            const error = new Error('El plan no existe o está borrado');
            error.statusCode = 400;
            throw error;
        }
        // 2. Actualizar los datos de la plan
        await planEncontrada.update(datosActualizados, { transaction });
        // 5. Retornar
        return planEncontrada;
    }
    catch (error) {
        throw error;
    }
};
exports.actualizarPlan = actualizarPlan;

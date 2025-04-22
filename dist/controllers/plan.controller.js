"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrarPlan = exports.ActualizarPlan = exports.NuevoPlan = exports.ObtenerPlanes = void 0;
const error_handle_1 = require("../utils/error.handle");
const database_1 = __importDefault(require("../config/database"));
const plan_service_1 = require("../services/plan.service");
const ObtenerPlanes = async (req, res) => {
    try {
        const listado = await (0, plan_service_1.obtenerPlanes)();
        const data = { "data": listado, "mensaje": "Zonas Encontradas" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener las Zonas', e);
    }
};
exports.ObtenerPlanes = ObtenerPlanes;
const NuevoPlan = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const plan = await (0, plan_service_1.nuevoPlan)(req.body, transaction);
        const data = { "data": plan, "mensaje": "Plan dado de alta", "log": `/ Plan(id):${plan.id}` };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al crear el Plan', e);
    }
};
exports.NuevoPlan = NuevoPlan;
const ActualizarPlan = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const plan = await (0, plan_service_1.actualizarPlan)(req.body, transaction);
        const data = { "data": plan, "mensaje": "Plan Actualizado", "log": `/ Plan(id):${plan.id}` };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al actualizar el Plan', e);
    }
};
exports.ActualizarPlan = ActualizarPlan;
const BorrarPlan = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const { id } = req.query;
        const plan = await (0, plan_service_1.borrarPlan)(id, transaction);
        const data = { "data": plan, "mensaje": "Plan eliminado", "log": `/ Zona(id):${plan.id}` };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al borrar el Plan', e);
    }
};
exports.BorrarPlan = BorrarPlan;

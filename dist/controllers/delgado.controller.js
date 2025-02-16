"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AltaDelegado = exports.ObtenerDelegados = void 0;
const error_handle_1 = require("../utils/error.handle");
const delegado_service_1 = require("../services/delegado.service");
const database_1 = __importDefault(require("../config/database"));
const ObtenerDelegados = async (req, res) => {
    try {
        const id_colegio = req.user?.id_colegio;
        const idConsulta = req.user?.id;
        const listado = await (0, delegado_service_1.listadoDelegados)(idConsulta, id_colegio);
        const data = { "data": listado, "mensaje": "Listado de Delegados obtenidos" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el listado de Delegados', e);
    }
};
exports.ObtenerDelegados = ObtenerDelegados;
const AltaDelegado = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idColegio = req.user?.id_colegio;
        const alta = await (0, delegado_service_1.altaDelegado)(idColegio, req.body, transaction);
        const data = { "data": alta,
            "mensaje": "Delegado dado de alta",
            "log": `/ Delegado(id):${alta.id}`,
            "idColegio": `${idColegio}` };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al dar de alta el Delegado', e);
    }
};
exports.AltaDelegado = AltaDelegado;

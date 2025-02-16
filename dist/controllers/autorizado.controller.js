"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AltaAutorizado = exports.ObtenerAutorizados = void 0;
const error_handle_1 = require("../utils/error.handle");
const database_1 = __importDefault(require("../config/database"));
const autorizados_service_1 = require("../services/autorizados.service");
const ObtenerAutorizados = async (req, res) => {
    try {
        const id_colegio = req.user?.id_colegio;
        const idConsulta = req.user?.id;
        const listado = await (0, autorizados_service_1.listadoAutorizados)(idConsulta, id_colegio);
        const data = { "data": listado, "mensaje": "Listado de AUtorizados obtenidos" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el listado de Autorizados', e);
    }
};
exports.ObtenerAutorizados = ObtenerAutorizados;
const AltaAutorizado = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idColegio = req.user?.id_colegio;
        const alta = await (0, autorizados_service_1.altaAutorizado)(idColegio, req.body, transaction);
        const data = { "data": alta,
            "mensaje": "Autorizado dado de alta",
            "log": `/ Autorizado(id):${alta.id}`,
            "idColegio": idColegio };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al dar de alta el Autorizado', e);
    }
};
exports.AltaAutorizado = AltaAutorizado;

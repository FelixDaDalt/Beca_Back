"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenerResponsables = exports.AltaResponsable = void 0;
const error_handle_1 = require("../utils/error.handle");
const database_1 = __importDefault(require("../config/database"));
const responsable_service_1 = require("../services/responsable.service");
const registro_service_1 = require("../services/registro.service");
const request_ip_1 = __importDefault(require("request-ip"));
const ObtenerResponsables = async (req, res) => {
    try {
        const idRol = req.user?.id_rol;
        let idColegio = undefined;
        const idConsulta = req.user?.id;
        if (idRol > 0) {
            idColegio = req.user?.id_colegio;
        }
        const listado = await (0, responsable_service_1.listadoResponsables)(idConsulta, idColegio);
        const data = { "data": listado, "mensaje": "Listado de responsables obtenidos" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el listado de responsables', e);
    }
};
exports.ObtenerResponsables = ObtenerResponsables;
const AltaResponsable = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const alta = await (0, responsable_service_1.altaResponsable)(req.body, transaction);
        const data = { "data": alta, "mensaje": "Responsable dado de alta" };
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 1, alta.id, "Alta", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction, alta.id_colegio);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al dar de alta el Responsable', e);
    }
};
exports.AltaResponsable = AltaResponsable;

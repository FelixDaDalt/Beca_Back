"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListadoBecas = exports.AltaBeca = void 0;
const error_handle_1 = require("../utils/error.handle");
const database_1 = __importDefault(require("../config/database"));
const beca_service_1 = require("../services/beca.service");
const AltaBeca = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const { idRed } = req.query;
        const becaCreada = await (0, beca_service_1.altaBeca)(req.body, idUsuario, idColegio, idRed, transaction);
        const data = { "data": becaCreada, "mensaje": "Red dada de Alta" };
        await transaction.commit();
        // 6. Enviar la respuesta
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al dar de alta la Red', e);
    }
};
exports.AltaBeca = AltaBeca;
const ListadoBecas = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idColegio = req.user?.id_colegio;
        const { idRed } = req.query;
        const becaCreada = await (0, beca_service_1.listadoBecas)(idRed, idColegio, transaction);
        const data = { "data": becaCreada, "mensaje": "Red dada de Alta" };
        await transaction.commit();
        // 6. Enviar la respuesta
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al dar de alta la Red', e);
    }
};
exports.ListadoBecas = ListadoBecas;

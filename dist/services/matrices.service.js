"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BecaService = void 0;
const database_1 = __importDefault(require("../config/database"));
const red_colegio_1 = require("../models/red_colegio");
class BecaService {
    static async altaBeca(idColegio, idRed, cantidad, transaction) {
        try {
            await red_colegio_1.red_colegio.update({
                bp: cantidad,
                btp: database_1.default.literal(`${cantidad} + 2`),
                db: cantidad,
                dbd: database_1.default.literal(`${cantidad} - dbu`),
                bde: database_1.default.literal(`(bp + 2) - bsa - bsp`)
            }, { where: { id_colegio: idColegio, id_red: idRed }, transaction });
        }
        catch (error) {
            throw new Error(`Error al actualizar matrices de alta de beca: ${error.message}`);
        }
    }
    /**
     * Registra una solicitud de beca.
     * - Incrementa `dbu` en el colegio solicitante.
     * - Incrementa `bsp` en el colegio solicitado.
     * - Recalcula `dbd` en el colegio solicitante.
     * - Recalcula `bde` en el colegio solicitado.
     */
    static async solicitarBeca(idColegioSolicitante, idColegioSolicitado, cantidad, idRed, transaction) {
        try {
            // Incrementa `dbu` en el colegio solicitante
            await red_colegio_1.red_colegio.increment({ dbu: cantidad }, { where: { id_colegio: idColegioSolicitante, id_red: idRed }, transaction });
            // Recalcula `dbd`
            await this.actualizarDBD(idColegioSolicitante, idRed, transaction);
            // Incrementa `bsp` en el colegio solicitado
            await red_colegio_1.red_colegio.increment({ bsp: cantidad }, { where: { id_colegio: idColegioSolicitado, id_red: idRed }, transaction });
            // Recalcula `bde`
            await this.actualizarBDE(idColegioSolicitado, idRed, transaction);
        }
        catch (error) {
            throw new Error(`Error al actualizar matrices: ${error.message}`);
        }
    }
    /**
     * Aprueba una beca solicitada.
     * - Incrementa `bsa` en el colegio solicitado.
     * - Decrementa `bsp` en el colegio solicitado.
     * - Recalcula `bde` en el colegio solicitado.
     */
    static async aprobarBeca(idColegioSolicitado, idRed, transaction) {
        try {
            await red_colegio_1.red_colegio.increment({ bsa: 1 }, { where: { id_colegio: idColegioSolicitado, id_red: idRed }, transaction });
            await red_colegio_1.red_colegio.decrement({ bsp: 1 }, { where: { id_colegio: idColegioSolicitado, id_red: idRed }, transaction });
            await this.actualizarBDE(idColegioSolicitado, idRed, transaction);
        }
        catch (error) {
            console.error("Error al aprobar beca:", error);
            throw error;
        }
    }
    /**
     * Cancela una solicitud de beca antes de su aprobación.
     * - Decrementa `dbu` en el colegio solicitante.
     * - Decrementa `bsp` en el colegio solicitado.
     * - Recalcula `dbd` en el colegio solicitante.
     * - Recalcula `bde` en el colegio solicitado.
     */
    static async rechazarBeca(colegioSolicitante, colegioSolicitado, idRed, transaction) {
        try {
            await red_colegio_1.red_colegio.decrement({ dbu: 1 }, { where: { id_colegio: colegioSolicitante, id_red: idRed }, transaction });
            await this.actualizarDBD(colegioSolicitante, idRed, transaction);
            await red_colegio_1.red_colegio.decrement({ bsp: 1 }, { where: { id_colegio: colegioSolicitado, id_red: idRed }, transaction });
            await this.actualizarBDE(colegioSolicitado, idRed, transaction);
        }
        catch (error) {
            console.error("Error al rechazar la beca:", error);
            throw error;
        }
    }
    /**
      * Desestima una solicitud de beca previamente realizada.
      * - Decrementa `dbu` en el colegio solicitante.
      * - Decrementa `bsp` en el colegio solicitado.
      * - Recalcula `dbd` en el colegio solicitante.
      * - Recalcula `bde` en el colegio solicitado.
      */
    static async desestimarBeca(colegioSolicitante, colegioSolicitado, idRed, transaction) {
        try {
            await red_colegio_1.red_colegio.decrement({ dbu: 1 }, { where: { id_colegio: colegioSolicitante, id_red: idRed }, transaction });
            await this.actualizarDBD(colegioSolicitante, idRed, transaction);
            await red_colegio_1.red_colegio.decrement({ bsp: 1 }, { where: { id_colegio: colegioSolicitado, id_red: idRed }, transaction });
            await this.actualizarBDE(colegioSolicitado, idRed, transaction);
        }
        catch (error) {
            console.error("Error al desestimar beca:", error);
            throw error;
        }
    }
    /**
     * Recalcula `dbd = db - dbu`
     */
    static async actualizarDBD(colegioId, idRed, transaction) {
        const colegio = await red_colegio_1.red_colegio.findOne({ where: { id_colegio: colegioId, id_red: idRed }, transaction });
        if (!colegio)
            throw new Error("Colegio no encontrado");
        const dbd = colegio.db - colegio.dbu;
        await red_colegio_1.red_colegio.update({ dbd }, { where: { id_colegio: colegioId, id_red: idRed }, transaction });
    }
    /**
     * Recalcula `bde = btp - bsa - bsp`
     */
    static async actualizarBDE(colegioId, idRed, transaction) {
        const colegio = await red_colegio_1.red_colegio.findOne({ where: { id_colegio: colegioId, id_red: idRed }, transaction });
        if (!colegio)
            throw new Error("Colegio no encontrado");
        const bde = colegio.btp - colegio.bsa - colegio.bsp;
        await red_colegio_1.red_colegio.update({ bde }, { where: { id_colegio: colegioId, id_red: idRed }, transaction });
    }
}
exports.BecaService = BecaService;

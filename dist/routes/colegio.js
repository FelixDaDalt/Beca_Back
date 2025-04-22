"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const session_1 = require("../middleware/session");
const colegio_controller_1 = require("../controllers/colegio.controller");
const roles_mid_1 = require("../middleware/roles.mid");
const colegio_upload_1 = __importDefault(require("../middleware/colegio_upload"));
const router = (0, express_1.Router)();
exports.router = router;
//Obtener
router.get('/obtener', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0, 1]), colegio_controller_1.ObtenerColegio);
router.get('/detalle', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0, 1, 2, 3]), colegio_controller_1.DetalleColegio);
router.get('/ver-colegio', session_1.comprobarJWT, colegio_controller_1.VerColegio);
router.post('/alta', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), colegio_upload_1.default.single('foto'), colegio_controller_1.AltaColegio);
router.get('/listado', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0, 1]), colegio_controller_1.ObtenerColegios);
router.put('/suspender', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), colegio_controller_1.SuspenderColegio);
router.put('/borrar', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), colegio_controller_1.BorrarColegio);
router.put('/editar', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0, 1]), colegio_upload_1.default.single('foto'), colegio_controller_1.EditarColegio);

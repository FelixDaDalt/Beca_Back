"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const session_1 = require("../middleware/session");
const usuario_controller_1 = require("../controllers/usuario.controller");
const roles_mid_1 = require("../middleware/roles.mid");
const avatar_upload_1 = __importDefault(require("../middleware/avatar_upload"));
;
const router = (0, express_1.Router)();
exports.router = router;
//Obtener
router.put('/cambiarPassword', session_1.comprobarJWT, usuario_controller_1.CambiarPassword);
router.put('/aceptarTyc', session_1.comprobarJWT, usuario_controller_1.AceptarTyc);
router.get('/tyc', session_1.comprobarJWT, usuario_controller_1.ObtenerTyc);
router.get('/detalle', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0, 1, 2, 3]), usuario_controller_1.Obtener);
router.put('/borrar', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0, 1, 2]), usuario_controller_1.Borrar);
router.put('/editar', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0, 1, 2, 3]), avatar_upload_1.default.single('foto'), usuario_controller_1.Editar);
router.get('/me', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([1, 2, 3]), usuario_controller_1.Me);
router.put('/suspender', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0, 1, 2]), usuario_controller_1.Suspender);
router.put('/resetearPass', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0, 1, 2]), usuario_controller_1.ResetarPass);

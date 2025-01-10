"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const admin_controller_1 = require("../controllers/admin.controller");
const express_1 = require("express");
const session_1 = require("../middleware/session");
const roles_mid_1 = require("../middleware/roles.mid");
const avatar_upload_1 = __importDefault(require("../middleware/avatar_upload"));
const router = (0, express_1.Router)();
exports.router = router;
//ALTAS
router.get('/listado', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), admin_controller_1.ObtenerAdministradores);
router.post('/alta', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), admin_controller_1.AltaAdministrador);
router.put('/suspender', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), admin_controller_1.SuspenderAdministrador);
router.put('/borrar', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), admin_controller_1.BorrarAdministrador);
router.get('/obtener', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), admin_controller_1.ObtenerAdministrador);
router.put('/editar', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), avatar_upload_1.default.single('foto'), admin_controller_1.Actualizar);
router.get('/me', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), admin_controller_1.Me);
router.post('/tyc/alta', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), admin_controller_1.NuevoTyc);
router.get('/tyc/historial', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), admin_controller_1.ListadoTyc);
router.get('/comprobar', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0, 1, 2]), admin_controller_1.Comprobar);

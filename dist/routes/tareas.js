"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const session_1 = require("../middleware/session");
const tareas_1 = require("../controllers/tareas");
const superAdmin_mid_1 = require("../middleware/superAdmin.mid");
const roles_mid_1 = require("../middleware/roles.mid");
const router = (0, express_1.Router)();
exports.router = router;
//ADMIN
router.post('/forzar-baja', session_1.comprobarJWT, (0, superAdmin_mid_1.superAdminRol)(), tareas_1.ProcesarBajas);
router.post('/notificar-porVencer', session_1.comprobarJWT, (0, superAdmin_mid_1.superAdminRol)(), tareas_1.ProcesarPorVencer);
router.post('/notificar-Vencidas', session_1.comprobarJWT, (0, superAdmin_mid_1.superAdminRol)(), tareas_1.ProcesarVencidas);
router.get('/obtener-ejecuciones', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), tareas_1.ObtenerEjecuciones);
router.get('/comprobar-red', session_1.comprobarJWT, (0, superAdmin_mid_1.superAdminRol)(), tareas_1.ComprobarRed);
router.get('/sincronizar-red', session_1.comprobarJWT, (0, superAdmin_mid_1.superAdminRol)(), tareas_1.SincronizarRed);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const session_1 = require("../middleware/session");
const zona_controller_1 = require("../controllers/zona.controller");
const roles_mid_1 = require("../middleware/roles.mid");
const router = (0, express_1.Router)();
exports.router = router;
//USUARIOS
router.get('/obtenerZonas', session_1.comprobarJWT, zona_controller_1.ObtenerZonas);
//ADMIN
router.post('/nuevaZona', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), zona_controller_1.NuevaZona);
router.post('/nuevaLocalidad', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), zona_controller_1.NuevaLocalidad);
router.put('/borrarZona', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), zona_controller_1.BorrarZona);
router.put('/borrarLocalidad', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), zona_controller_1.BorrarLocalidad);
router.put('/actualizarZona', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), zona_controller_1.ActualizarLocalidad);
router.put('/actualizarLocalidad', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), zona_controller_1.ActualizarZona);

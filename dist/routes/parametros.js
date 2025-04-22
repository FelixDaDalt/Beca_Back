"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const session_1 = require("../middleware/session");
const roles_mid_1 = require("../middleware/roles.mid");
const parametro_controller_1 = require("../controllers/parametro.controller");
const router = (0, express_1.Router)();
exports.router = router;
//ADMIN
router.put('/actualizar', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), parametro_controller_1.ActualizarParametro);
router.get('/obtener', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), parametro_controller_1.ObtenerParametros);

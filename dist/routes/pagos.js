"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const session_1 = require("../middleware/session");
const roles_mid_1 = require("../middleware/roles.mid");
const pagos_controller_1 = require("../controllers/pagos.controller");
const router = (0, express_1.Router)();
exports.router = router;
//ADMIN
router.get('/obtenerPagos', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), pagos_controller_1.ObtenerPagos);
router.put('/actualizarPagos', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), pagos_controller_1.ActualizarPagos);

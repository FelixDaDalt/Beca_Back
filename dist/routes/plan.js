"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const session_1 = require("../middleware/session");
const roles_mid_1 = require("../middleware/roles.mid");
const plan_controller_1 = require("../controllers/plan.controller");
const router = (0, express_1.Router)();
exports.router = router;
//ADMIN
router.get('/obtenerPlanes', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), plan_controller_1.ObtenerPlanes);
router.post('/nuevoPlan', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), plan_controller_1.NuevoPlan);
router.put('/borrarPlan', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), plan_controller_1.BorrarPlan);
router.put('/actualizarPlan', session_1.comprobarJWT, (0, roles_mid_1.verificarRoles)([0]), plan_controller_1.ActualizarPlan);

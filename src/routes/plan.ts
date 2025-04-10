
import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { ActualizarPlan, BorrarPlan, NuevoPlan, ObtenerPlanes } from "../controllers/plan.controller";

const router = Router()


//ADMIN
router.get('/obtenerPlanes',comprobarJWT,verificarRoles([0]), ObtenerPlanes);
router.post('/nuevoPlan',comprobarJWT, verificarRoles([0]), NuevoPlan);
router.put('/borrarPlan',comprobarJWT, verificarRoles([0]), BorrarPlan);
router.put('/actualizarPlan',comprobarJWT, verificarRoles([0]), ActualizarPlan);


export {router} 

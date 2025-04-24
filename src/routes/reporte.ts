
import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { BorrarReporte, NuevoReporte, ObtenerReportes } from "../controllers/reporte.controller";

const router = Router()
router.post('/nuevo',comprobarJWT, verificarRoles([1]), NuevoReporte);
router.get('/listado',comprobarJWT, verificarRoles([0]), ObtenerReportes)
router.put('/borrar',comprobarJWT, verificarRoles([0]), BorrarReporte)

export {router} //exportamos la rutas

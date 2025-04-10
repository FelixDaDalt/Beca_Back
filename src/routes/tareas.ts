
import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { ObtenerEjecuciones, ProcesarBajas, ProcesarPorVencer, ProcesarVencidas } from "../controllers/tareas";

const router = Router()


//ADMIN
router.post('/forzar-baja',comprobarJWT,verificarRoles([0]), ProcesarBajas);
router.post('/notificar-porVencer',comprobarJWT,verificarRoles([0]),ProcesarPorVencer);
router.post('/notificar-Vencidas',comprobarJWT,verificarRoles([0]), ProcesarVencidas);
router.get('/obtener-ejecuciones',comprobarJWT,verificarRoles([0]), ObtenerEjecuciones);
export {router} 

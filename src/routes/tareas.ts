
import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { ComprobarRed, ObtenerEjecuciones, ProcesarBajas, ProcesarPorVencer, ProcesarVencidas, SincronizarRed } from "../controllers/tareas";

const router = Router()


//ADMIN
router.post('/forzar-baja',comprobarJWT,verificarRoles([0]), ProcesarBajas);
router.post('/notificar-porVencer',comprobarJWT,verificarRoles([0]),ProcesarPorVencer);
router.post('/notificar-Vencidas',comprobarJWT,verificarRoles([0]), ProcesarVencidas);
router.get('/obtener-ejecuciones',comprobarJWT,verificarRoles([0]), ObtenerEjecuciones);
router.get('/comprobar-red',comprobarJWT,verificarRoles([0]), ComprobarRed);
router.get('/sincronizar-red',comprobarJWT,verificarRoles([0]), SincronizarRed);

export {router} 

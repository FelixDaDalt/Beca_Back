
import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { ComprobarRed, ObtenerEjecuciones, ProcesarBajas, ProcesarPorVencer, ProcesarVencidas, SincronizarRed } from "../controllers/tareas";
import { superAdminRol } from "../middleware/superAdmin.mid";
import { verificarRoles } from "../middleware/roles.mid";

const router = Router()


//ADMIN
router.post('/forzar-baja',comprobarJWT,superAdminRol(), ProcesarBajas);
router.post('/notificar-porVencer',comprobarJWT,superAdminRol(),ProcesarPorVencer);
router.post('/notificar-Vencidas',comprobarJWT,superAdminRol(), ProcesarVencidas);
router.get('/obtener-ejecuciones',comprobarJWT,verificarRoles([0]), ObtenerEjecuciones);
router.get('/comprobar-red',comprobarJWT,superAdminRol(), ComprobarRed);
router.get('/sincronizar-red',comprobarJWT,superAdminRol(), SincronizarRed);

export {router} 

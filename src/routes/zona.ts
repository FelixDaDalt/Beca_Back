
import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { ActualizarLocalidad, ActualizarZona, BorrarLocalidad, BorrarZona, NuevaLocalidad, NuevaZona, ObtenerZonas } from "../controllers/zona.controller";
import { verificarRoles } from "../middleware/roles.mid";

const router = Router()

//USUARIOS
router.get('/obtenerZonas',comprobarJWT, ObtenerZonas);

//ADMIN
router.post('/nuevaZona',comprobarJWT, verificarRoles([0]), NuevaZona);
router.post('/nuevaLocalidad',comprobarJWT, verificarRoles([0]), NuevaLocalidad);
router.put('/borrarZona',comprobarJWT, verificarRoles([0]), BorrarZona);
router.put('/borrarLocalidad',comprobarJWT, verificarRoles([0]), BorrarLocalidad);
router.put('/actualizarZona',comprobarJWT, verificarRoles([0]), ActualizarLocalidad);
router.put('/actualizarLocalidad',comprobarJWT, verificarRoles([0]), ActualizarZona);

export {router} 


import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { AltaDelegado, ObtenerDelegados } from "../controllers/delgado.controller";
import { AltaAutorizado, BorrarAutorizado, EditarAutorizado, ObtenerAutorizado, ObtenerAutorizados, SuspenderAutorizado } from "../controllers/autorizado.controller";

const router = Router()
router.post('/alta',comprobarJWT, verificarRoles([1]), AltaAutorizado);
router.get('/listado',comprobarJWT, verificarRoles([0,1]), ObtenerAutorizados)
router.get('/obtener',comprobarJWT, verificarRoles([0,1]), ObtenerAutorizado)
router.put('/editar',comprobarJWT, verificarRoles([1]), EditarAutorizado)
router.put('/borrar',comprobarJWT, verificarRoles([1]), BorrarAutorizado)
router.put('/suspender',comprobarJWT, verificarRoles([1]), SuspenderAutorizado)

export {router} //exportamos la rutas

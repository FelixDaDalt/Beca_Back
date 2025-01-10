
import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { AltaDelegado, ObtenerDelegados } from "../controllers/delgado.controller";
import { AltaAutorizado, ObtenerAutorizados } from "../controllers/autorizado.controller";

const router = Router()
router.post('/alta',comprobarJWT, verificarRoles([1,2]), AltaAutorizado);
router.get('/listado',comprobarJWT, verificarRoles([1,2,3]), ObtenerAutorizados)

export {router} //exportamos la rutas

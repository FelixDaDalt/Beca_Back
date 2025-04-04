
import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { AltaDelegado, ObtenerDelegados } from "../controllers/delgado.controller";

const router = Router()
// router.post('/alta',comprobarJWT, verificarRoles([1]), AltaDelegado);
// router.get('/listado',comprobarJWT, verificarRoles([1,2]), ObtenerDelegados)

export {router} //exportamos la rutas

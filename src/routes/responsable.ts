
import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";

import { AltaResponsable, ObtenerResponsables } from "../controllers/responsable.controller";
import { verificarRoles } from "../middleware/roles.mid";

const router = Router()
router.post('/alta',comprobarJWT, verificarRoles([0]), AltaResponsable);
router.get('/listado',comprobarJWT, verificarRoles([0,1]), ObtenerResponsables)

export {router} //exportamos la rutas



import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { AltaRed, BorrarRed, ObtenerRedes } from "../controllers/red.controller";


const router = Router()

router.post('/alta',comprobarJWT, verificarRoles([0]), AltaRed);
router.get('/listado',comprobarJWT, verificarRoles([0]), ObtenerRedes);
router.put('/borrar',comprobarJWT,verificarRoles([0]), BorrarRed);

export {router} //exportamos la rutas

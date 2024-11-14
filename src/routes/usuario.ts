

import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { AceptarTyc, CambiarPassword,ObtenerTyc, Obtener, ResetarPass, Suspender, Borrar} from "../controllers/usuario.controller";
import { verificarRoles } from "../middleware/roles.mid";
;

const router = Router()

//Obtener
router.put('/cambiarPassword',comprobarJWT, CambiarPassword)
router.put('/aceptarTyc',comprobarJWT, AceptarTyc)
router.get('/tyc',comprobarJWT, ObtenerTyc)
router.get('/detalle',comprobarJWT, verificarRoles([0,1,2]), Obtener)
router.put('/borrar',comprobarJWT, verificarRoles([0,1,2]), Borrar)

router.put('/suspender',comprobarJWT, verificarRoles([0,1,2]), Suspender)
router.get('/resetearPass',comprobarJWT,verificarRoles([0,1,2]), ResetarPass)

export {router} //exportamos la rutas

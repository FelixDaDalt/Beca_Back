

import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { AceptarTyc, CambiarPassword,ObtenerTyc, Obtener, ResetarPass, Suspender, Borrar, Me, Editar} from "../controllers/usuario.controller";
import { verificarRoles } from "../middleware/roles.mid";
import uploadAvatar from "../middleware/avatar_upload";
;

const router = Router()

//Obtener
router.put('/cambiarPassword',comprobarJWT, CambiarPassword)
router.put('/aceptarTyc',comprobarJWT, AceptarTyc)
router.get('/tyc',comprobarJWT, ObtenerTyc)
router.get('/detalle',comprobarJWT, verificarRoles([0,1,2,3]), Obtener)
router.put('/borrar',comprobarJWT, verificarRoles([0,1,2]), Borrar)
router.put('/editar',comprobarJWT, verificarRoles([0,1,2,3]), uploadAvatar.single('foto'), Editar)
router.get('/me',comprobarJWT, verificarRoles([1,2,3]),Me)

router.put('/suspender',comprobarJWT, verificarRoles([0,1,2]), Suspender)
router.put('/resetearPass',comprobarJWT,verificarRoles([0,1,2]), ResetarPass)

export {router} //exportamos la rutas

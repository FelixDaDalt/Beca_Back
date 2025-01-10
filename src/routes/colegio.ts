

import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { AltaColegio, BorrarColegio, DetalleColegio, EditarColegio, ObtenerColegio, ObtenerColegios, SuspenderColegio } from "../controllers/colegio.controller";
import { verificarRoles } from "../middleware/roles.mid";
import uploadColegio from "../middleware/colegio_upload";


const router = Router()

//Obtener
router.get('/obtener',comprobarJWT,verificarRoles([0,1]), ObtenerColegio)
router.get('/detalle',comprobarJWT, verificarRoles([0,1,2,3]),DetalleColegio)

router.post('/alta',comprobarJWT, verificarRoles([0]),uploadColegio.single('foto'), AltaColegio);
router.get('/listado',comprobarJWT,verificarRoles([0,1]), ObtenerColegios)
router.put('/suspender',comprobarJWT,verificarRoles([0]), SuspenderColegio)
router.put('/borrar',comprobarJWT,verificarRoles([0]), BorrarColegio)
router.put('/editar',comprobarJWT, verificarRoles([0,1]),uploadColegio.single('foto'), EditarColegio);

export {router} //exportamos la rutas

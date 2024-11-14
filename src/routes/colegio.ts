

import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { AltaColegio, DetalleColegio, ObtenerColegio, ObtenerColegios, SuspenderColegio } from "../controllers/colegio.controller";
import { verificarRoles } from "../middleware/roles.mid";


const router = Router()

//Obtener
router.get('/obtener',comprobarJWT,verificarRoles([0,1]), ObtenerColegio)
router.get('/detalle',comprobarJWT, verificarRoles([0,1,2,3]),DetalleColegio)

router.post('/alta',comprobarJWT, verificarRoles([0]), AltaColegio);
router.get('/listado',comprobarJWT,verificarRoles([0]), ObtenerColegios)
router.put('/suspender',comprobarJWT,verificarRoles([0]), SuspenderColegio)
export {router} //exportamos la rutas

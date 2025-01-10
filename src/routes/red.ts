

import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { AltaRed, BorrarMiembro, BorrarRed, ColegiosDisponibles, EditarDatosRed, EditarMiembrosRed, Me, ObtenerMiembros, ObtenerRed, ObtenerRedes } from "../controllers/red.controller";
import upload from "../middleware/upload";
import { editarMiembrosRed } from "services/red.service";


const router = Router()

router.post('/alta', comprobarJWT, verificarRoles([0]), upload.single('foto'),AltaRed);
router.get('/listado',comprobarJWT, verificarRoles([0,1,2,3]), ObtenerRedes);
router.put('/borrar',comprobarJWT,verificarRoles([0]), BorrarRed);
router.put('/editarDatos', comprobarJWT, verificarRoles([0,1,2]), upload.single('foto'), EditarDatosRed);
router.get('/obtener',comprobarJWT,verificarRoles([0,1,2,3]), ObtenerRed)

router.get('/colegiosDisponibles',comprobarJWT,verificarRoles([0,1]), ColegiosDisponibles)
router.put('/borrarMiembro',comprobarJWT,verificarRoles([0]), BorrarMiembro)
router.put('/editarMiembros',comprobarJWT,verificarRoles([0,1]), EditarMiembrosRed)

router.get('/obtenerMiembros',comprobarJWT,verificarRoles([0,1,2,3]), ObtenerMiembros)
router.get('/me',comprobarJWT,verificarRoles([1,2,3]), Me)
export {router} //exportamos la rutas

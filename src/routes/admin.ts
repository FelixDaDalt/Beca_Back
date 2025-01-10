
import { AltaAdministrador, Comprobar, ObtenerAdministradores, NuevoTyc, ListadoTyc, SuspenderAdministrador, ObtenerAdministrador, BorrarAdministrador, Me, Actualizar} from "../controllers/admin.controller";
import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import uploadAvatar from "../middleware/avatar_upload";


const router = Router()

//ALTAS
router.get('/listado',comprobarJWT,verificarRoles([0]), ObtenerAdministradores)
router.post('/alta',comprobarJWT,verificarRoles([0]), AltaAdministrador);
router.put('/suspender',comprobarJWT,verificarRoles([0]), SuspenderAdministrador);
router.put('/borrar',comprobarJWT,verificarRoles([0]), BorrarAdministrador);
router.get('/obtener',comprobarJWT,verificarRoles([0]), ObtenerAdministrador);
router.put('/editar',comprobarJWT, verificarRoles([0]), uploadAvatar.single('foto'), Actualizar)
router.get('/me',comprobarJWT,verificarRoles([0]), Me);

router.post('/tyc/alta',comprobarJWT, verificarRoles([0]), NuevoTyc);
router.get('/tyc/historial',comprobarJWT,verificarRoles([0]), ListadoTyc)

router.get('/comprobar',comprobarJWT,verificarRoles([0,1,2]), Comprobar)








export {router} //exportamos la rutas


import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { ObtenerRegistros, ObtenerRegistrosAdministrador } from "../controllers/registro.controller";


const router = Router()

router.get('/listado',comprobarJWT,verificarRoles([0,1,2]), ObtenerRegistros)
router.get('/listadoAdmin',comprobarJWT,verificarRoles([0]), ObtenerRegistrosAdministrador)








export {router} //exportamos la rutas

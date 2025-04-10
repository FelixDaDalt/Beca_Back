

import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { Notificaciones } from "../controllers/notificacion.controller";
import { NotificacionesAdmin } from "../controllers/notificacionAdmin.controller";


const router = Router()

router.get('/listado', comprobarJWT, verificarRoles([1]), Notificaciones);
router.get('/listadoAdmin', comprobarJWT, verificarRoles([0]), NotificacionesAdmin);

export {router} //exportamos la rutas

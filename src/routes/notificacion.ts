

import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { Notificaciones } from "../controllers/notificacion.controller";


const router = Router()

router.get('/listado', comprobarJWT, verificarRoles([0,1,2,3]), Notificaciones);

export {router} //exportamos la rutas

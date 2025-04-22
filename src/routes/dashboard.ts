

import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { Dashboard } from "../controllers/dashboard.controller";


const router = Router()

router.get('/', comprobarJWT, verificarRoles([0]), Dashboard);

export {router} //exportamos la rutas

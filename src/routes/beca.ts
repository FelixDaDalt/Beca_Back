

import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { AltaBeca, ListadoBecas } from "../controllers/beca.controller";


const router = Router()

router.get('/listado', comprobarJWT, verificarRoles([0,1,2,3]), ListadoBecas);
router.post('/alta', comprobarJWT, verificarRoles([1,2]), AltaBeca);

export {router} //exportamos la rutas

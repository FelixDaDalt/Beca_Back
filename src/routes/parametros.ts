
import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { ActualizarParametro, ObtenerParametros } from "../controllers/parametro.controller";

const router = Router()


//ADMIN

router.put('/actualizar',comprobarJWT,verificarRoles([0]),ActualizarParametro );
router.get('/obtener',comprobarJWT,verificarRoles([0]), ObtenerParametros);

export {router} 

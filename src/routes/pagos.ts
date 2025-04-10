
import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { ActualizarPagos, ObtenerPagos } from "../controllers/pagos.controller";

const router = Router()


//ADMIN
router.get('/obtenerPagos',comprobarJWT,verificarRoles([0]), ObtenerPagos);
router.put('/actualizarPagos',comprobarJWT, verificarRoles([0]), ActualizarPagos);


export {router} 

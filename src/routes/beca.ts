

import { Router } from "express"; 
import { comprobarJWT } from "../middleware/session";
import { verificarRoles } from "../middleware/roles.mid";
import { AltaBeca, DarDeBajaSolicitud, DesestimarSolicitud, ListadoBecas, MiSolicitudDetalle, MisSolicitudesBeca, ResolverSolicitud, SolicitarBeca, SolicitudDetalle, SolicitudesBeca } from "../controllers/beca.controller";


const router = Router()

router.get('/listado', comprobarJWT, verificarRoles([0,1,2,3]), ListadoBecas);
router.post('/alta', comprobarJWT, verificarRoles([1,2]), AltaBeca);
router.post('/solicitar', comprobarJWT, verificarRoles([1,2,3]), SolicitarBeca);


router.get('/solicitudes', comprobarJWT, verificarRoles([1,2]), SolicitudesBeca);
router.get('/solicitud-detalle', comprobarJWT, verificarRoles([1,2,3]), SolicitudDetalle);

router.get('/mis-solicitudes', comprobarJWT, verificarRoles([1,2,3]), MisSolicitudesBeca);
router.get('/mi-solicitud-detalle', comprobarJWT, verificarRoles([1,2,3]), MiSolicitudDetalle);

router.post('/resolver', comprobarJWT, verificarRoles([1,2]), ResolverSolicitud);
router.post('/desestimar', comprobarJWT, verificarRoles([1,2,3]), DesestimarSolicitud);
router.post('/dar-baja', comprobarJWT, verificarRoles([1,2]), DarDeBajaSolicitud);
export {router} //exportamos la rutas

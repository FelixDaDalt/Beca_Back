import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { registrarEvento } from "../services/registro.service"
import requestIp from 'request-ip';
import { altaBeca, listadoBecas } from "../services/beca.service"


const AltaBeca = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 
        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const {idRed} = req.query 

        const becaCreada = await altaBeca(req.body, idUsuario,idColegio,idRed as string,transaction);
        const data = { "data": becaCreada , "mensaje": "Red dada de Alta" };

        await transaction.commit();
        
        // 6. Enviar la respuesta
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al dar de alta la Red', e);    
    }
};

const ListadoBecas = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 

        const idColegio = req.user?.id_colegio;
        const {idRed} = req.query 

        const becaCreada = await listadoBecas(idRed as string,idColegio,transaction);
        const data = { "data": becaCreada , "mensaje": "Red dada de Alta" };

        await transaction.commit();
        
        // 6. Enviar la respuesta
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al dar de alta la Red', e);    
    }
};

export {AltaBeca, ListadoBecas}
import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { login} from "../services/auth.service"


const Login = async (req:Request,res:Response)=>{
    try{
        const { tipo } = req.query;
        const nuevoLogin = await login(req.body,tipo as string, req.ip || '', req.headers['user-agent'] as string)
        const data = {"data":nuevoLogin,"mensaje":"Ingreso Exitoso"}
        res.status(200).send(data)       
    }catch(e){
        handleHttp(res,'Error al ingresar',e)    
    }
}




export {Login }
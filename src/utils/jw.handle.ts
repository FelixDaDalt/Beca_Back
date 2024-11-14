import {sign, verify} from 'jsonwebtoken'


const secret = process.env.JWT_SECRET || 'secret'

const generarToken = async (id: string | number, id_rol: number | string, dni: string | number,id_colegio:string | number | null) => {
    const fecha_ingreso = new Date()
    const jwt = sign({ 
        id, 
        id_rol, 
        fecha_ingreso,
        dni,
        id_colegio 
    }, secret, {
        expiresIn: "2h",
    });
    return jwt;
};

const verificarToken = async (jwt: string) => {
    try {
        const ok = await verify(jwt, secret);
        return ok; 
    } catch (error) {
        return null
    }
};
export{generarToken,verificarToken}
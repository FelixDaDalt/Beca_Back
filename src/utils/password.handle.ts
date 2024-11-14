import { hash,compare } from "bcryptjs"

const encriptar = async (pass:string)=>{
    const passwordhash = await hash(pass,10)
    return passwordhash
}

const verificar = async (pass:string, passHash:string)=>{
    const correcto = await compare(pass,passHash)
    return correcto
}

export {encriptar,verificar}
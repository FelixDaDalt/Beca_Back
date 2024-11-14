import { encriptar } from "../utils/password.handle";
import { usuario } from "../models/usuario";
import sequelize from "../config/database";
import { Op, Transaction } from "sequelize";



const altaAutorizado = async (idColegio:number, nuevoAutorizado: usuario,transaction:Transaction) => {

    try {
        // 1. Verificar si el usuario existe por DNI
        const autorizadoExistente = await usuario.findOne({
            where: {
                dni: nuevoAutorizado.dni,
                borrado: 0
            },
            transaction, 
        });

  
        if (autorizadoExistente) {
            const error = new Error('El Dni ya se encuentra registrado');
            (error as any).statusCode = 400; 
            throw error;
        }


        // 2. Encriptar contraseña
        const passEncrypt = await encriptar(nuevoAutorizado.password);
        nuevoAutorizado.password = passEncrypt;

        // 3. Agregar el delegado
        nuevoAutorizado.id_rol = 3;
        nuevoAutorizado.id_colegio = idColegio; 
        const agregarAutorizado = await usuario.create(nuevoAutorizado, { transaction }); // Incluye la transacción

        // 5. Devolver el token y los datos del usuario al cliente
        const { password, borrado, id_rol, ...AutorizadoRegistrado} = agregarAutorizado.dataValues;

        return {...AutorizadoRegistrado}
            
        
    } catch (error) {

        throw error;
    }
};

const listadoAutorizados = async (idConsulta:string, id_colegio:number) => {
    try {
        const listado = await usuario.findAll({
            where: {
                id_rol:3,
                id_colegio:id_colegio,
                borrado: 0,
                id: { [Op.ne]: idConsulta }
            },
            attributes: { exclude: ['borrado','password'] },
        });

        return listado;
    } catch (error) {
        throw error;
    }
};



export{altaAutorizado,listadoAutorizados }
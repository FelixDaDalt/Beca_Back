import { encriptar } from "../utils/password.handle";
import { usuario } from "../models/usuario";
import sequelize from "../config/database";
import { Op, Transaction } from "sequelize";



const altaDelegado = async (idColegio:number, nuevoDelegado: usuario,transaction:Transaction) => {
    try {
        // 1. Verificar si el usuario existe por DNI
        const delegadoExistente = await usuario.findOne({
            where: {
                dni: nuevoDelegado.dni,
                borrado: 0
            },
            transaction, 
        });

  
        if (delegadoExistente) {
            const error = new Error('El Dni ya se encuentra registrado');
            (error as any).statusCode = 400; 
            throw error;
        }


        // 2. Encriptar contraseña
        const passEncrypt = await encriptar(nuevoDelegado.password);
        nuevoDelegado.password = passEncrypt;

        // 3. Agregar el delegado
        nuevoDelegado.id_rol = 2;
        nuevoDelegado.id_colegio = idColegio;
        nuevoDelegado.cambiarPass = 1; 
        const agregarDelegado = await usuario.create(nuevoDelegado, { transaction }); // Incluye la transacción

        // 5. Devolver el token y los datos del usuario al cliente
        const { password, borrado, id_rol, ...DelegadoRegistrado} = agregarDelegado.dataValues;

        return {...DelegadoRegistrado}
            
        
    } catch (error) {

        throw error;
    }
};

const listadoDelegados = async (idConsulta:string, id_colegio:number) => {
    try {
        const listado = await usuario.findAll({
            where: {
                id_rol:2,
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



export{altaDelegado,listadoDelegados }
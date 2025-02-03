import { encriptar } from "../utils/password.handle";
import { usuario } from "../models/usuario";
import { colegio } from "../models/colegio";
import { zona_localidad } from "../models/zona_localidad";
import { Op, Transaction } from "sequelize";


///RESPONSABLES////

const altaResponsable = async (nuevoResponsable: usuario, transaction:Transaction) => {

    try {
        // 1. Verificar si el usuario existe por DNI
        const usuarioExistente = await usuario.findOne({
            where: {
                dni: nuevoResponsable.dni,
                borrado: 0
            },
            transaction, 
        });

  
        if (usuarioExistente) {
            const error = new Error('El Dni ya se encuentra registrado');
            (error as any).statusCode = 400; 
            throw error;
        }

        // 2. Encriptar contraseña
        const passEncrypt = await encriptar(nuevoResponsable.password);
        nuevoResponsable.password = passEncrypt;

        // 3. Agregar el responsable
        nuevoResponsable.id_rol = 1; 
        nuevoResponsable.cambiarPass = 1;
        const agregarResponsable = await usuario.create(nuevoResponsable, { transaction }); // Incluye la transacción

        // 5. Devolver el token y los datos del usuario al cliente
        const { password, borrado, id_rol, ...responsableRegistrado } = agregarResponsable.dataValues;

        return { ...responsableRegistrado}
        
    } catch (error) {
        throw error;
    }
};

const listadoResponsables = async (idConsulta:string, idColegio?:number) => {
    try {
        const whereCondicion = idColegio 
            ? { id_colegio: idColegio, id_rol: 1, borrado: 0, id: { [Op.ne]: idConsulta } } 
            : { id_rol: 1, borrado: 0, id: { [Op.ne]: idConsulta } };

        const listado = await usuario.findAll({
            where: whereCondicion,
            attributes: { exclude: ['borrado','password','id_colegio'] },
            include: [{
                model: colegio,
                as: 'id_colegio_colegio',
                required:false,
                include:[{
                    model:zona_localidad,
                    as:'id_zona_zona_localidad',
                    required:false,
                }],
                attributes: { exclude: ['logo', 'borrado'] },
            }]
        });

        return listado;
    } catch (error) {
        throw error;
    }
};



export{altaResponsable,listadoResponsables }
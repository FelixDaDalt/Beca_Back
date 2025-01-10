import { encriptar } from "../utils/password.handle";
import { usuario } from "../models/usuario";
import { colegio } from "../models/colegio";
import { compare } from "bcryptjs";
import { tyc } from "../models/tyc";
import { administrador } from "../models/administrador";
import { Transaction } from "sequelize";
import { roles } from "../models/roles";

const cambiarPassword = async (pass:string, idUsuario:string,idRol:string,transaction:Transaction) => {
    try {
        if (!pass || !idUsuario) {
            const error = new Error('Debe proporcionar un ID usuario y una Contraseña');
            (error as any).statusCode = 400; 
            throw error;
        }

        let usuarioEncontrado;

        if(Number(idRol)>0){
            usuarioEncontrado = await usuario.findOne({
                where: {
                    id:idUsuario,
                    borrado: 0,
                },include:[{
                    model:colegio,
                    as:'id_colegio_colegio',
                    required:true
                },
                {
                    model: roles,
                    as: 'id_rol_role',
                    attributes: ['descripcion'],
                    required: true
                }],
                transaction
            });
            
        }else{
            usuarioEncontrado = await administrador.findOne({
                where: {
                    id:idUsuario,
                    borrado: 0
                },transaction
            });
        }
        
        

        if (!usuarioEncontrado) {
            const error = new Error('No se encontro usuario con ID proporcionado');
            (error as any).statusCode = 409; 
            throw error;
        }

        const passEncrypt = await encriptar(pass);
        usuarioEncontrado.password = passEncrypt;
        usuarioEncontrado.cambiarPass=0;
        await usuarioEncontrado.save({transaction})

        const { password, borrado, ...usuarioLogueado } = usuarioEncontrado.dataValues;
        
        return {datos: usuarioLogueado}

    } catch (error) {
        throw error;
    }
};

const aceptarTyc = async (idUsuario: string, pass:string,transaction:Transaction) => {
    try {
        if (!pass || !idUsuario) {
            const error = new Error('Debe proporcionar un ID usuario y una Contraseña');
            (error as any).statusCode = 400; 
            throw error;
        }

        // 1. Buscar al usuario existente
        const usuarioExistente = await usuario.findOne({
            where: { id: idUsuario, borrado: 0 },
            include: [{
                model: colegio,
                as: 'id_colegio_colegio',
                required: true,
                attributes: ['suspendido', 'nombre'],
                },
                {
                    model: roles,
                    as: 'id_rol_role',
                    attributes: ['descripcion'],
                    required: true
                }],
                transaction 
        });

        // 2. Lanzar un error si el usuario no existe
        if (!usuarioExistente) {
            const error = new Error('Usuario inexistente');
            (error as any).statusCode = 400;
            throw error;
        }
        
        // 3. Validar la contraseña
        const contraseñaValida = await compare(pass, usuarioExistente.password);
        
        if (!contraseñaValida) {
            const error = new Error('Contraseña incorrecta');
            (error as any).statusCode = 400;
            throw error;
        }

        // 4. Aceptar Termino
        usuarioExistente.tyc = 1
        
        // 5. Guardar los cambios en el usuario
        await usuarioExistente.save({transaction});
        
        const { password, borrado, ...usuarioLogueado } = usuarioExistente.dataValues;
        
        return {datos: usuarioLogueado}
        
    } catch (error) {
        throw error;
    }
};

const obtenerTyc = async () => {
    try {

        const tycExistente = await tyc.findOne({
            order: [['id', 'DESC']] // O usa `id` si es autoincremental
        });

        return tycExistente
        
    } catch (error) {
        throw error;
    }
};

const suspender = async (idRol:number, idUsuario:string, transaction:Transaction) => {
        
    try {

        const usuarioExistente = await usuario.findOne({
            where:{
                id:idUsuario,
                borrado:0
            }
        })

        if(!usuarioExistente){
            const error = new Error('El Usuario no existe');
            (error as any).statusCode = 400; 
            throw error;
        }

        if(idRol > usuarioExistente.id_rol){
            const error = new Error('No tiene permisos para suspender al usuario');
            (error as any).statusCode = 400; 
            throw error;
        }

        // Cambiar estado de suspensión
        usuarioExistente.suspendido = usuarioExistente.suspendido == 1 ? 0 : 1;
        
        // Guardar cambios
        await usuarioExistente.save({ transaction });

        // 4. Retornar
        return usuarioExistente

    } catch (error) {
        throw error;
    }
};

const borrar = async (idRol:number, idUsuario:string, transaction:Transaction) => {
        
    try {

        const usuarioExistente = await usuario.findOne({
            where:{
                id:idUsuario,
                borrado:0
            }
        })

        if(!usuarioExistente){
            const error = new Error('El Usuario no existe');
            (error as any).statusCode = 400; 
            throw error;
        }

        if(idRol > usuarioExistente.id_rol){
            const error = new Error('No tiene permisos para borrar al usuario');
            (error as any).statusCode = 400; 
            throw error;
        }

        const usuariosConRol = await usuario.count({
            where: {
                id_colegio: usuarioExistente.id_colegio,
                id_rol: usuarioExistente.id_rol,
                borrado: 0
            }
        });

        if (usuarioExistente.id_rol === 1 && usuariosConRol === 1) {
            const error = new Error('No se puede eliminar el único usuario con rol de responsable del colegio');
            (error as any).statusCode = 400;
            throw error;
        }

        // Cambiar estado de suspensión
        usuarioExistente.borrado = 1;
        
        // Guardar cambios
        await usuarioExistente.save({ transaction });

        // 4. Retornar
        return usuarioExistente

    } catch (error) {
        throw error;
    }
};

const resetarPass = async (idRol:number, transaction:Transaction, userId?: string, adminId?: string) => {

    try {
        let findUser;

        if (userId) {
            findUser = await usuario.findOne({
                where: { 
                    id: userId, 
                    borrado: 0 
                },
                attributes: { 
                    exclude: ['borrado', 'password'] 
                },
                transaction,
            });

            if (!findUser) {
                const error = new Error('No se encontró el usuario');
                (error as any).statusCode = 409;
                throw error;
            }

            if(findUser.id_rol < idRol){
                const error = new Error('No tienes permiso para reiniciar el password del usuario');
                (error as any).statusCode = 409;
                throw error;
            }

            const dni = findUser.dni;
            const passEncrypt = await encriptar(dni);
            findUser.password = passEncrypt;
            findUser.cambiarPass = 1
            await findUser.save({ transaction });

        } else if (adminId) {
            findUser = await administrador.findOne({
                where: { 
                    id: adminId, 
                    borrado: 0 
                },
                attributes: { 
                    exclude: ['borrado', 'password'] 
                },
                transaction,
            });

            if (!findUser) {
                const error = new Error('No se encontró el administrador');
                (error as any).statusCode = 409;
                throw error;
            }

            if(idRol > findUser.id_rol){
                const error = new Error('No tienes permiso para reiniciar el password del usuario');
                (error as any).statusCode = 409;
                throw error;
            }

            const dni = findUser.dni;
            const passEncrypt = await encriptar(dni);
            findUser.password = passEncrypt;
            findUser.cambiarPass = 1
            await findUser.save({ transaction });
            
        }else{
            const error = new Error('Se debe proporcionar ID usuario o administrador para restablecer la contraseña');
            (error as any).statusCode = 400;
            throw error;
        }

        return findUser;

    } catch (error) {
        throw error;
    }
};

const obtenerUsuario = async (idUsuario:string) => {
    try {

        const usuarioExistente = await usuario.findOne({
            where:[{
                id:idUsuario,
                borrado:0
            }],
            attributes:{exclude:['borrado','password']},
            include:[{
                model:colegio,
                as:'id_colegio_colegio',
                required:false,
                attributes:['id','nombre','cuit']
            }]
        });

        if (!usuarioExistente) {
            const error = new Error('Usuario inexistente');
            (error as any).statusCode = 400;
            throw error;
        }

        return usuarioExistente
        
    } catch (error) {
        throw error;
    }
};

const editar = async (update:usuario, idUsuario:number, idRol:number, transaction:Transaction,idColegio?:number) => {
    try {

        if(idRol > 1 && update.id != idUsuario){
            const error = new Error('No puedes editar otro usuario');
            (error as any).statusCode = 400; 
            throw error;
        }

        const usuarioExistente = await usuario.findOne({
            where:{
                id:update.id,
                borrado:0
            }
        })

        if(!usuarioExistente){
            const error = new Error('El Usuario no existe');
            (error as any).statusCode = 400; 
            throw error;
        }

        if(idRol == 1 && usuarioExistente.id_colegio != idColegio){
            const error = new Error('No puedes editar el usuario de otro colegio');
            (error as any).statusCode = 400; 
            throw error;
        }

        const estadoAnterior = { ...usuarioExistente.toJSON() };

        await usuario.update(update, {
            where: { id: update.id },
            transaction,
        });

        // 4. Retornar
        return update

    } catch (error) {
        throw error;
    }
};

const me = async (idUsuario:string) => {
    try {

        const usuarioExistente = await usuario.findOne({
            where:[{
                id:idUsuario,
                borrado:0
            }],
            attributes:{exclude:['borrado','password']},
            include:[{
                model:colegio,
                as:'id_colegio_colegio',
                required:false,
                attributes:['id','nombre','cuit','foto']
            },{
               
                    model:roles,
                    as:'id_rol_role',
                    required:false,
                    attributes:['descripcion']
            }]
        });

        if (!usuarioExistente) {
            const error = new Error('Usuario inexistente');
            (error as any).statusCode = 400;
            throw error;
        }

        return usuarioExistente
        
    } catch (error) {
        throw error;
    }
};


export{cambiarPassword,aceptarTyc,obtenerTyc,suspender,resetarPass,obtenerUsuario,borrar,editar,me }
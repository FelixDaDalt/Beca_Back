import { zona_localidad } from "../models/zona_localidad";
import { zona } from "../models/zona"
import { Transaction } from "sequelize";


const obtenerZonas = async () => {
    try {
        const zonasEncontradas = await zona.findAll({
            where: {
                borrado: 0
            },
            attributes: { exclude: ['borrado'] },
            include:[{
                model:zona_localidad,
                as:'zona_localidads',
                where:{borrado:0},
                required:false,
                attributes: { exclude: ['borrado'] }
            }]
        });

        return zonasEncontradas;

    } catch (error) {
        throw error;
    }
};

const nuevaZona = async (zonaNueva: zona, transaction:Transaction) => {
    try {
        
        // 1. Dar de alta los terminos
        const nuevaZona = await zona.create(zonaNueva, { transaction });

        // 4. Retornar
        return nuevaZona 

    } catch (error) {
        throw error;
    }
};

const nuevaLocalidad = async (localidadNueva: zona_localidad,transaction:Transaction) => {
    // Inicia la transacción
    try {

        // 1. bucar si existe la zona

        const zonaEncontrada = await zona.findOne({
            where:{
                id:localidadNueva.id_zona,
                borrado:0
            },
            transaction
        })

        if(!zonaEncontrada){
            const error = new Error('La zona no existe para crear la localidad');
            (error as any).statusCode = 400; 
            throw error;
        }
        
        // 2. Dar de alta la localidad
        const nuevo = await zona_localidad.create(localidadNueva, { transaction });

        // 5. Retornar
        return nuevo

    } catch (error) {
        throw error;
    }
};

const borrarZona = async (idZona: string,transaction:Transaction) => {

    try {
        // 1. Buscar la zona y verificar si ya está borrada
        const zonaEncontrada = await zona.findOne({
            where: { id: idZona, borrado: 0 },
            transaction
        });

        if (!zonaEncontrada) {
            const error = new Error('La zona no existe o ya está borrada');
            (error as any).statusCode = 400;
            throw error;
        }

        // 2. Marcar la zona como borrada
        await zonaEncontrada.update({ borrado: 1 }, {transaction});

        // 5. Retornar
        return zonaEncontrada

    } catch (error) {
        throw error;
    }
};

const borrarLocalidad = async (idLocalidad: string, transaction:Transaction) => {

    try {
        // 1. Buscar la localidad y verificar si ya está borrada
        const localidadEncontrada = await zona_localidad.findOne({
            where: { id: idLocalidad, borrado: 0 },
            transaction
        });

        if (!localidadEncontrada) {
            const error = new Error('La localidad no existe o ya está borrada');
            (error as any).statusCode = 400;
            throw error;
        }

        // 2. Marcar la localidad como borrada
        await localidadEncontrada.update({ borrado: 1 }, {transaction});

        // 5. Retornar
        return localidadEncontrada

    } catch (error) {
        throw error;
    }
};

const actualizarZona = async (datosActualizados:zona, transaction:Transaction) => {
    try {
        // 1. Buscar la zona y verificar que no esté borrada
        const zonaEncontrada = await zona.findOne({
            where: { id: datosActualizados.id, borrado: 0 },
            transaction
        });

        if (!zonaEncontrada) {
            const error = new Error('La zona no existe o está borrada');
            (error as any).statusCode = 400;
            throw error;
        }

        // 2. Actualizar los datos de la zona
        await zonaEncontrada.update(datosActualizados, {transaction});


        // 5. Retornar
        return zonaEncontrada

    } catch (error) {
        throw error;
    }
};

const actualizarLocalidad = async (datosActualizados:zona_localidad, transaction:Transaction) => {

    try {
        // 1. Buscar la localidad y verificar que no esté borrada
        const localidadEncontrada = await zona_localidad.findOne({
            where: { id: datosActualizados.id, borrado: 0 },
            transaction
        });

        if (!localidadEncontrada) {
            const error = new Error('La localidad no existe o está borrada');
            (error as any).statusCode = 400;
            throw error;
        }

        const zonaEncontrada = await zona.findOne({
            where:{
                id:datosActualizados.id_zona,
                borrado:0
            },
            transaction
        })

        if(!zonaEncontrada){
            const error = new Error('La zona no existe para crear la localidad');
            (error as any).statusCode = 400; 
            throw error;
        }

        // 2. Actualizar los datos de la localidad
        await localidadEncontrada.update(datosActualizados, {transaction});

        // 5. Retornar
        return localidadEncontrada

    } catch (error) {

        throw error;
    }
};


export{obtenerZonas, nuevaZona,nuevaLocalidad,borrarZona,borrarLocalidad,actualizarZona,actualizarLocalidad}
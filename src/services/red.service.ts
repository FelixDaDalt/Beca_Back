import { colegio } from "../models/colegio"
import { Op, Sequelize, Transaction } from "sequelize";
import { red } from "../models/red";
import { red_colegio } from "../models/red_colegio";
import { beca } from "../models/beca";

interface nuevaRed{
    red:red
    colegios:[
        {
            id:number,
            anfitrion:number
        }
    ]
}

interface edicionMiembros{
    id_red:number,
    integrantes:[{
        id:number,
        anfitrion:number
    }]
}

const altaRed = async (altaRed: nuevaRed, transaction:Transaction) => {
    try {
        
        const anfitriones = altaRed.colegios.filter(colegio => colegio.anfitrion === 1);
        if (anfitriones.length !== 1) {
            const error = new Error('Debe haber un único colegio anfitrión');
            (error as any).statusCode = 400;
            throw error;
        }
        
        // 1. Verificar si el colegio existe por CUIT
        const colegioInexistente = await colegio.findOne({
            where: {
                id: {
                    [Op.in]: altaRed.colegios.map((colegio) => colegio.id)  // Filtra por lista de IDs
                },
                borrado: 1  // Busca solo los colegios con borrado = 1
            },
            transaction: transaction
        });
        
        if (colegioInexistente) {
            const error = new Error('Algunos colegios están marcados como borrados');
            (error as any).statusCode = 409;
            throw error;
        }

        const redCreada = await red.create(altaRed.red,{transaction });

        // 3. Insertar los registros en la tabla intermedia red_colegio
        const redColegiosData = altaRed.colegios.map((colegio) => ({
            id_red: redCreada.id,  // Usamos el ID de la red recién creada
            id_colegio: colegio.id,  // Usamos el ID del colegio
            anfitrion:colegio.anfitrion
        }));

        try {
            await red_colegio.bulkCreate(redColegiosData, { transaction });
        } catch (error) {
            const errorMensaje = new Error('Error al asociar los colegios a la red');
            throw errorMensaje;
        }

        // 4. Retornar la respuesta de éxito
        return redCreada;

    } catch (error) {
        throw error;
    }
};

const listadoRedes = async (idColegio?: string) => {
    try { 
        
        const whereCondition = idColegio ? { id_colegio: idColegio,borrado:0 } : {borrado:0}; // Solo agregar si existe idColegio

        const listado = await red.findAll({
            where: { borrado: 0 },
            attributes: { exclude: ['borrado'] },
            include: [
                {
                    model: red_colegio,
                    as: 'red_colegios',
                    required: !!idColegio,
                    where:whereCondition,
                    attributes: ['id_colegio', 'id_red', 'anfitrion'],
                    include: [
                        {
                            model: colegio,
                            as: 'id_colegio_colegio',
                            attributes: ['id', 'nombre', 'cuit']
                        }
                    ]
                }
            ]
        });
     
        const redes = listado.map((redItem) => {
            const { red_colegios, ...resto } = redItem.toJSON() as any;
        
            // Buscar el colegio anfitrión (siempre devolver el objeto `id_colegio_colegio` del registro con `anfitrion: true`)
            const anfitrionColegio = red_colegios.find((rc: any) => rc.anfitrion === true)?.id_colegio_colegio || null;
            // Verificar si el idColegio proporcionado es anfitrión
            const esAnfitrion = idColegio
                ? red_colegios.some((rc: any) => rc.id_colegio === idColegio && rc.anfitrion === true)
                : false;
        
            return {
                ...resto,
                Anfitrion: anfitrionColegio,
                esAnfitrion,
            };
        });
        

        // Inicializar las categorías
        let misRedes: any[] = [];
        let vinculado: any[] = [];

        if (idColegio) {
            // Filtrar categorías solo si se pasa un idColegio
            misRedes = redes.filter((red) => red.esAnfitrion);
            vinculado = redes.filter((red) => !red.esAnfitrion);
        }
        
        return {
            redes,
            misRedes,
            vinculado
        };
    } catch (error) {
        throw error;
    }
};

const borrarRed = async (idRed:string, transaction:Transaction) => {
        
    try {

        const redExistente = await red.findOne({
            where:{
                id:idRed,
                borrado:0
            },
            include:[{
                model:red_colegio,
                as:'red_colegios',
            },
            {
                model:beca,
                as:'becas',
            }]
        })

        if(!redExistente){
            const error = new Error('La red no existe');
            (error as any).statusCode = 400; 
            throw error;
        }


        // Cambiar estado de borrado
        redExistente.borrado = 1;
        
        // Guardar cambios
        await redExistente.save({ transaction });

        if(redExistente.red_colegios && redExistente.red_colegios.length>0){
            for (const red_colegio of redExistente.red_colegios) {
                red_colegio.borrado = 1;
                await red_colegio.save({ transaction });
            }
            
        }

        if(redExistente.becas && redExistente.becas.length>0){
            for (const beca of redExistente.becas) {
                beca.borrado = 1;
                await beca.save({ transaction });
            }
            
        }

        // 4. Retornar
        return redExistente

    } catch (error) {
        throw error;
    }
};

const obtenerRed = async (idRed:string) => {
    try {
        const redEncontrada = await red.findOne({
            where: {
                id: idRed,
                borrado: 0
            },
            attributes: ['id', 'fecha_hora', 'nombre', 'foto', 'porcentaje', 'caracteristicas'],
            include: [{
                model: red_colegio,
                as: 'red_colegios',
                where: {
                    anfitrion: true
                },
                    include: [{
                        model: colegio,
                        as: 'id_colegio_colegio', // Asegúrate de que esta relación esté configurada
                        required:true
                    }],
                required: true,
            }]
        });

        if (!redEncontrada) {
            const error = new Error('No se encontro ninguna red asociada');
            (error as any).statusCode = 409; 
            throw error;
        }

        const resultado = {
            id: redEncontrada.id,
            fecha_hora: redEncontrada.fecha_hora,
            nombre: redEncontrada.nombre,
            foto: redEncontrada.foto,
            porcentaje: redEncontrada.porcentaje,
            caracteristicas: redEncontrada.caracteristicas,
            Anfitrion: redEncontrada.red_colegios?.[0]?.id_colegio_colegio || null // El primer colegio anfitrión (si existe)
        };

        return resultado;

    } catch (error) {
        throw error;
    }
};

const colegiosDisponibles = async (idRed: string) => {
    try {
        // Obtener la red y los colegios asociados a ella
        const redEncontrada = await red.findOne({
            where: {
                id: idRed,
                borrado: 0,
            },
            attributes: [], // No necesitamos datos de la red
            include: [
                {
                    model: red_colegio,
                    as: 'red_colegios',
                    required: false,
                    where: { borrado: 0 },
                    include: [
                        {
                            model: colegio,
                            as: 'id_colegio_colegio',
                            required: false,
                        },
                    ],
                },
            ],
        });

        if (!redEncontrada) {
            const error = new Error('No se encontró ninguna red asociada');
            (error as any).statusCode = 409;
            throw error;
        }

        // Extraer miembros y convertir logos a Base64
        const miembros = redEncontrada.red_colegios.map((redColegio: any) => {
            const colegio = redColegio.id_colegio_colegio;

            const colegioPlano = colegio ? colegio.toJSON() : {};
            if (redColegio.anfitrion) {
                colegioPlano.anfitrion = 1;
            }
            return colegioPlano;
        });

        // Obtener IDs de colegios que ya están en la red
        const idsMiembros = redEncontrada.red_colegios.map((colegio: any) => colegio.id_colegio);

        // Obtener los colegios que NO están en la red
        const disponibles = await colegio.findAll({
            where: {
                id: {
                    [Op.notIn]: idsMiembros, // Excluir los IDs de los colegios en la red
                },
                borrado: 0, // Asegurarnos de no incluir colegios "borrados"
            },
        });


        return {
            disponibles: disponibles, // Colegios que no están en la red
            miembros,                         // Colegios que ya están en la red
        };
    } catch (error) {
        throw error;
    }
};

const borrarMiembro = async (idRed: string, idColegio:string,transaction:Transaction) => {
    try {
        // Obtener la red y los colegios asociados a ella
        const colegioEncontrado = await red_colegio.findOne({
            where: {
                id_colegio: idColegio,
                id_red: idRed, // Relacionamos colegio con la red
                borrado: 0,    // Aseguramos que solo obtenemos los registros activos (no borrados)
            }
        });
        
        if (!colegioEncontrado) {
            const error = new Error('No se encontró la relación de colegio con la red');
            (error as any).statusCode = 409;
            throw error;
        }
        
        // Marcar como borrado la relación en la tabla intermedia
        colegioEncontrado.borrado = 1;  // Aquí marcamos el campo 'borrado' como 1
        
        // Guardamos la instancia con el campo 'borrado' actualizado
        await colegioEncontrado.save({ transaction });
        
        return colegioEncontrado;
    } catch (error) {
        throw error;
    }
};

const editarDatosRed = async (datosRed: red, idRol:number, idColegio:string, transaction:Transaction) => {
    try {
        // Obtener la red y los colegios asociados a ella
        const redEncontrada = await red.findOne({
            where: {
                id: datosRed.id,
                borrado: 0,    // Aseguramos que solo obtenemos los registros activos (no borrados)
            }
        });
        
        if (!redEncontrada) {
            const error = new Error('No se encontró la Red');
            (error as any).statusCode = 409;
            throw error;
        }

        const estadoAnterior = { ...redEncontrada.toJSON() };

        if(idRol > 0){
                // Obtener el colegio al que pertenece el usuario
            const redColegio = await red_colegio.findOne({
                where: {
                    id_red: datosRed.id,
                    id_colegio: idColegio,
                },
            });

            if (!redColegio) {
                const error = new Error('El colegio del usuario no está asociado a esta red');
                (error as any).statusCode = 403;
                throw error;
            }

            if (!redColegio.anfitrion) {
                const error = new Error('El colegio del usuario no es anfitrión de esta red');
                (error as any).statusCode = 403;
                throw error;
            }

            datosRed.nombre = redEncontrada.nombre
        }
       

        await red.update(datosRed, {
            where: { id: datosRed.id },
            transaction,
        });

        return {
            datosRed,
            estadoAnterior
        };

    } catch (error) {
        throw error;
    }
};

const editarMiembrosRed = async (miembros: edicionMiembros, idRol: number, idColegio: string, transaction: Transaction) => {
    try {
        // Obtener la red y los colegios asociados a ella
        const redEncontrada = await red.findOne({
            where: {
                id: miembros.id_red,
                borrado: 0,
            },
        });

        if (!redEncontrada) {
            const error = new Error('No se encontró la Red');
            (error as any).statusCode = 409;
            throw error;
        }

        const whereCondition: any = {
            id_red: miembros.id_red,
        };
        
        if (idRol > 0) {
            whereCondition.id_colegio = idColegio;
        }
        
        const redColegio = await red_colegio.findOne({
            where: whereCondition,
        });
;

        if (!redColegio) {
            const error = new Error('El colegio del usuario no está asociado a esta red');
            (error as any).statusCode = 403;
            throw error;
        }

        if (!redColegio.anfitrion) {
            const error = new Error('El colegio del usuario no es anfitrión de esta red');
            (error as any).statusCode = 403;
            throw error;
        }

        // Obtener todos los colegios de la red
        const colegiosExistentes = await red_colegio.findAll({
            where: {
                id_red: miembros.id_red,
            },
        });

        // Crear mapas para identificar rápidamente qué hacer con cada integrante
        const colegiosMap = new Map(
            colegiosExistentes.map((colegio) => [colegio.id_colegio, colegio])
        );

        const colegiosAActualizar = [];
        const colegiosANuevos = [];

        for (const integrante of miembros.integrantes) {
            const colegio = colegiosMap.get(integrante.id);
            if (colegio) {
                if (colegio.borrado == 1) {
                    colegiosAActualizar.push(integrante.id);
                }
            } else {

                colegiosANuevos.push({
                    id_red: miembros.id_red,
                    id_colegio: integrante.id,
                    anfitrion: integrante.anfitrion || 0,
                    borrado: 0,
                });
            }
        }

        // Realizar actualizaciones en una sola operación
        if (colegiosAActualizar.length > 0) {
            await red_colegio.update(
                { borrado: 0 },
                {
                    where: {
                        id_red: miembros.id_red,
                        id_colegio: colegiosAActualizar,
                    },
                    transaction,
                }
            );
        }

        // Crear nuevos registros en una sola operación
        if (colegiosANuevos.length > 0) {
            await red_colegio.bulkCreate(colegiosANuevos, { transaction });
        }

        return {
            red:redEncontrada,
            colegiosAActualizar, 
            colegiosANuevos}
        
    } catch (error) {
        throw error;
    }
};




//Miembros
const obtenerMiembros = async (idRed:string, rol:number) => {
    try {
        const whereBorrado: any = rol == 0 ? {id_red: idRed}:{id_red: idRed,borrado:0};

        const miembrosEcnontrados = await red_colegio.findAll({
            where: whereBorrado,
            include: [{
                model: colegio,
                as: 'id_colegio_colegio', // Asegúrate de que esta relación esté configurada
                required: false
            }],
            order: [
                ['anfitrion', 'DESC'], 
                [{ model: colegio, as: 'id_colegio_colegio' }, 'nombre', 'ASC'] 
            ]
        });

        return miembrosEcnontrados;

    } catch (error) {
        throw error;
    }
};

const meRed = async (idRed:string, idColegio:string) => {
    try {
        const misDatos = await red_colegio.findOne({
            where: {
                id_red: idRed,
                id_colegio: idColegio,
                borrado: 0
            },
            attributes: ['id_colegio','id_red','bp', 'db', 'dbu', 'dbd','anfitrion'], // Atributos de la tabla red_colegio
        });

        const bp = misDatos?.bp || 0; // Becas publicadas
        const db = misDatos?.db || 0; // Derecho a becas (siempre igual a bp)
        const dbu = misDatos?.dbu || 0; // Derecho a becas utilizadas
        const dbd = misDatos?.dbd || 0; // Derecho a becas disponibles

        // Calcular los porcentajes
        const porcentajeDbu = bp > 0 ? (dbu / bp) * 100 : 0; // Porcentaje de derecho a becas utilizadas
        const porcentajeDbd = bp > 0 ? ((bp - dbu) / bp) * 100 : 0; // Porcentaje de derecho a becas disponibles

        const estadisticasEnPorcentaje = {
            bp: bp>0?100:0, // Becas publicadas siempre son el 100%
            db: db>0?100:0, // Derecho a becas es igual a becas publicadas, por lo tanto, también 100%
            dbu: porcentajeDbu, // Porcentaje de becas utilizadas
            dbd: porcentajeDbd, // Porcentaje de becas disponibles
        };
        

        return {
            misDatos,
            estadisticas:estadisticasEnPorcentaje
        };

    } catch (error) {
        throw error;
    }
};
export{altaRed,listadoRedes,borrarRed, obtenerRed,colegiosDisponibles,borrarMiembro,editarDatosRed,editarMiembrosRed,obtenerMiembros,meRed}
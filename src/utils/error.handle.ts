import { Response } from "express";
import { ValidationError } from "sequelize";

const handleHttp = (res: Response, error: string, errorRaw: any) => {
    let statusCode = errorRaw.statusCode || 500; 
    let message = errorRaw.message || 'Internal Server Error';

    // Manejo de errores específicos
    switch (statusCode) {
        case 401:
            message =  message;
            break;
        case 400:
            message = message;
            break;
        case 409:
            message = message; 
            break;
        case 500:
            console.log(errorRaw)
            console.log(errorRaw.message)
            message = 'Ocurrió un error en el servidor durante el procesamiento de la solicitud: ' + message;
            break;
        default:
            message = errorRaw.message || 'Error inesperado.';
            break;
    }

    // Mostrar el error en el log para depuración
    console.log(`Error ${statusCode}: ${message}`);

    // Enviar respuesta al cliente
    res.status(statusCode).send({
        "Error": error,
        "Descripcion": message,
        
    });
};

export { handleHttp };

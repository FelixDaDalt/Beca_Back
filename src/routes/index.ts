import { Router } from "express"
import {readdirSync} from "fs" //leer directorios

const path_rutas = `${__dirname}` //nos devuelve la ruta del directorio actual "src/routes"
const routes = Router()

const limpiarExtension = (filename:string) => {
    const file = filename.split('.').shift()
    return file
}

///Nos devuelve arreglo con los archivos de un diectorio
readdirSync(path_rutas).filter(archivo => 
    {
        const archivoSinExtension = limpiarExtension(archivo)
        if(archivoSinExtension!=="index")
           import(`./${archivoSinExtension}`).then((moduloRuta)=>{
            console.log("se esta cargando la ruta " + archivoSinExtension)
            routes.use(`/${archivoSinExtension}`,moduloRuta.router)
        
        })
    }
)

export {routes}
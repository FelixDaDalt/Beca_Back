"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const fs_1 = require("fs"); //leer directorios
const path_rutas = `${__dirname}`; //nos devuelve la ruta del directorio actual "src/routes"
const routes = (0, express_1.Router)();
exports.routes = routes;
const limpiarExtension = (filename) => {
    const file = filename.split('.').shift();
    return file;
};
///Nos devuelve arreglo con los archivos de un diectorio
(0, fs_1.readdirSync)(path_rutas).filter(archivo => {
    const archivoSinExtension = limpiarExtension(archivo);
    if (archivoSinExtension !== "index")
        Promise.resolve(`${`./${archivoSinExtension}`}`).then(s => __importStar(require(s))).then((moduloRuta) => {
            console.log("se esta cargando la ruta " + archivoSinExtension);
            routes.use(`/api/${archivoSinExtension}`, moduloRuta.router);
        });
});

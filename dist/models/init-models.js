"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zona_localidad = exports.zona = exports.usuario = exports.tyc = exports.roles = exports.registroeventos = exports.red_colegio = exports.red = exports.menu = exports.ingresos_usuarios = exports.ingresos_administradores = exports.entidad_tipo = exports.colegio = exports.beca_solicitud = exports.beca_resolucion = exports.beca_estado = exports.beca = exports.administrador = void 0;
exports.initModels = initModels;
const administrador_1 = require("./administrador");
Object.defineProperty(exports, "administrador", { enumerable: true, get: function () { return administrador_1.administrador; } });
const beca_1 = require("./beca");
Object.defineProperty(exports, "beca", { enumerable: true, get: function () { return beca_1.beca; } });
const beca_estado_1 = require("./beca_estado");
Object.defineProperty(exports, "beca_estado", { enumerable: true, get: function () { return beca_estado_1.beca_estado; } });
const beca_resolucion_1 = require("./beca_resolucion");
Object.defineProperty(exports, "beca_resolucion", { enumerable: true, get: function () { return beca_resolucion_1.beca_resolucion; } });
const beca_solicitud_1 = require("./beca_solicitud");
Object.defineProperty(exports, "beca_solicitud", { enumerable: true, get: function () { return beca_solicitud_1.beca_solicitud; } });
const colegio_1 = require("./colegio");
Object.defineProperty(exports, "colegio", { enumerable: true, get: function () { return colegio_1.colegio; } });
const entidad_tipo_1 = require("./entidad_tipo");
Object.defineProperty(exports, "entidad_tipo", { enumerable: true, get: function () { return entidad_tipo_1.entidad_tipo; } });
const ingresos_administradores_1 = require("./ingresos_administradores");
Object.defineProperty(exports, "ingresos_administradores", { enumerable: true, get: function () { return ingresos_administradores_1.ingresos_administradores; } });
const ingresos_usuarios_1 = require("./ingresos_usuarios");
Object.defineProperty(exports, "ingresos_usuarios", { enumerable: true, get: function () { return ingresos_usuarios_1.ingresos_usuarios; } });
const menu_1 = require("./menu");
Object.defineProperty(exports, "menu", { enumerable: true, get: function () { return menu_1.menu; } });
const red_1 = require("./red");
Object.defineProperty(exports, "red", { enumerable: true, get: function () { return red_1.red; } });
const red_colegio_1 = require("./red_colegio");
Object.defineProperty(exports, "red_colegio", { enumerable: true, get: function () { return red_colegio_1.red_colegio; } });
const registroeventos_1 = require("./registroeventos");
Object.defineProperty(exports, "registroeventos", { enumerable: true, get: function () { return registroeventos_1.registroeventos; } });
const roles_1 = require("./roles");
Object.defineProperty(exports, "roles", { enumerable: true, get: function () { return roles_1.roles; } });
const tyc_1 = require("./tyc");
Object.defineProperty(exports, "tyc", { enumerable: true, get: function () { return tyc_1.tyc; } });
const usuario_1 = require("./usuario");
Object.defineProperty(exports, "usuario", { enumerable: true, get: function () { return usuario_1.usuario; } });
const zona_1 = require("./zona");
Object.defineProperty(exports, "zona", { enumerable: true, get: function () { return zona_1.zona; } });
const zona_localidad_1 = require("./zona_localidad");
Object.defineProperty(exports, "zona_localidad", { enumerable: true, get: function () { return zona_localidad_1.zona_localidad; } });
function initModels(sequelize) {
    const administrador = administrador_1.administrador.initModel(sequelize);
    const beca = beca_1.beca.initModel(sequelize);
    const beca_estado = beca_estado_1.beca_estado.initModel(sequelize);
    const beca_resolucion = beca_resolucion_1.beca_resolucion.initModel(sequelize);
    const beca_solicitud = beca_solicitud_1.beca_solicitud.initModel(sequelize);
    const colegio = colegio_1.colegio.initModel(sequelize);
    const entidad_tipo = entidad_tipo_1.entidad_tipo.initModel(sequelize);
    const ingresos_administradores = ingresos_administradores_1.ingresos_administradores.initModel(sequelize);
    const ingresos_usuarios = ingresos_usuarios_1.ingresos_usuarios.initModel(sequelize);
    const menu = menu_1.menu.initModel(sequelize);
    const red = red_1.red.initModel(sequelize);
    const red_colegio = red_colegio_1.red_colegio.initModel(sequelize);
    const registroeventos = registroeventos_1.registroeventos.initModel(sequelize);
    const roles = roles_1.roles.initModel(sequelize);
    const tyc = tyc_1.tyc.initModel(sequelize);
    const usuario = usuario_1.usuario.initModel(sequelize);
    const zona = zona_1.zona.initModel(sequelize);
    const zona_localidad = zona_localidad_1.zona_localidad.initModel(sequelize);
    colegio.belongsToMany(red, { as: 'id_red_reds', through: red_colegio, foreignKey: "id_colegio", otherKey: "id_red" });
    red.belongsToMany(colegio, { as: 'id_colegio_colegios', through: red_colegio, foreignKey: "id_red", otherKey: "id_colegio" });
    ingresos_administradores.belongsTo(administrador, { as: "id_usuario_administrador", foreignKey: "id_usuario" });
    administrador.hasMany(ingresos_administradores, { as: "ingresos_administradores", foreignKey: "id_usuario" });
    registroeventos.belongsTo(administrador, { as: "administrador", foreignKey: "administrador_id" });
    administrador.hasMany(registroeventos, { as: "registroeventos", foreignKey: "administrador_id" });
    beca_solicitud.belongsTo(beca, { as: "id_beca_beca", foreignKey: "id_beca" });
    beca.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_beca" });
    beca_solicitud.belongsTo(beca_estado, { as: "id_estado_beca_estado", foreignKey: "id_estado" });
    beca_estado.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_estado" });
    beca_solicitud.belongsTo(beca_resolucion, { as: "id_resolucion_beca_resolucion", foreignKey: "id_resolucion" });
    beca_resolucion.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_resolucion" });
    beca.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio" });
    colegio.hasMany(beca, { as: "becas", foreignKey: "id_colegio" });
    beca_solicitud.belongsTo(colegio, { as: "id_colegio_solic_colegio", foreignKey: "id_colegio_solic" });
    colegio.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_colegio_solic" });
    red_colegio.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio" });
    colegio.hasMany(red_colegio, { as: "red_colegios", foreignKey: "id_colegio" });
    registroeventos.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio" });
    colegio.hasMany(registroeventos, { as: "registroeventos", foreignKey: "id_colegio" });
    usuario.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio" });
    colegio.hasMany(usuario, { as: "usuarios", foreignKey: "id_colegio" });
    registroeventos.belongsTo(entidad_tipo, { as: "entidad_tipo", foreignKey: "entidad_tipo_id" });
    entidad_tipo.hasMany(registroeventos, { as: "registroeventos", foreignKey: "entidad_tipo_id" });
    beca.belongsTo(red, { as: "id_red_red", foreignKey: "id_red" });
    red.hasMany(beca, { as: "becas", foreignKey: "id_red" });
    red_colegio.belongsTo(red, { as: "id_red_red", foreignKey: "id_red" });
    red.hasMany(red_colegio, { as: "red_colegios", foreignKey: "id_red" });
    administrador.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol" });
    roles.hasMany(administrador, { as: "administradors", foreignKey: "id_rol" });
    registroeventos.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol" });
    roles.hasMany(registroeventos, { as: "registroeventos", foreignKey: "id_rol" });
    usuario.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol" });
    roles.hasMany(usuario, { as: "usuarios", foreignKey: "id_rol" });
    beca.belongsTo(usuario, { as: "id_usuario_usuario", foreignKey: "id_usuario" });
    usuario.hasMany(beca, { as: "becas", foreignKey: "id_usuario" });
    beca_solicitud.belongsTo(usuario, { as: "id_usuario_solic_usuario", foreignKey: "id_usuario_solic" });
    usuario.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_usuario_solic" });
    beca_solicitud.belongsTo(usuario, { as: "id_usuario_reso_usuario", foreignKey: "id_usuario_reso" });
    usuario.hasMany(beca_solicitud, { as: "id_usuario_reso_beca_solicituds", foreignKey: "id_usuario_reso" });
    beca_solicitud.belongsTo(usuario, { as: "id_usuario_baja_usuario", foreignKey: "id_usuario_baja" });
    usuario.hasMany(beca_solicitud, { as: "id_usuario_baja_beca_solicituds", foreignKey: "id_usuario_baja" });
    ingresos_usuarios.belongsTo(usuario, { as: "id_usuario_usuario", foreignKey: "id_usuario" });
    usuario.hasMany(ingresos_usuarios, { as: "ingresos_usuarios", foreignKey: "id_usuario" });
    registroeventos.belongsTo(usuario, { as: "usuario", foreignKey: "usuario_id" });
    usuario.hasMany(registroeventos, { as: "registroeventos", foreignKey: "usuario_id" });
    zona_localidad.belongsTo(zona, { as: "id_zona_zona", foreignKey: "id_zona" });
    zona.hasMany(zona_localidad, { as: "zona_localidads", foreignKey: "id_zona" });
    colegio.belongsTo(zona_localidad, { as: "id_zona_zona_localidad", foreignKey: "id_zona" });
    zona_localidad.hasMany(colegio, { as: "colegios", foreignKey: "id_zona" });
    return {
        administrador: administrador,
        beca: beca,
        beca_estado: beca_estado,
        beca_resolucion: beca_resolucion,
        beca_solicitud: beca_solicitud,
        colegio: colegio,
        entidad_tipo: entidad_tipo,
        ingresos_administradores: ingresos_administradores,
        ingresos_usuarios: ingresos_usuarios,
        menu: menu,
        red: red,
        red_colegio: red_colegio,
        registroeventos: registroeventos,
        roles: roles,
        tyc: tyc,
        usuario: usuario,
        zona: zona,
        zona_localidad: zona_localidad,
    };
}

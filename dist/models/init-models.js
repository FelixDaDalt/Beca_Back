"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zona_localidad = exports.zona = exports.usuario = exports.tyc = exports.roles = exports.red_colegio = exports.red = exports.menu = exports.colegio = exports.beca_solicitud = exports.beca_resolucion = exports.beca_estado = exports.beca = exports.administrador = exports.actividad_log = void 0;
exports.initModels = initModels;
const actividad_log_1 = require("./actividad_log");
Object.defineProperty(exports, "actividad_log", { enumerable: true, get: function () { return actividad_log_1.actividad_log; } });
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
const menu_1 = require("./menu");
Object.defineProperty(exports, "menu", { enumerable: true, get: function () { return menu_1.menu; } });
const red_1 = require("./red");
Object.defineProperty(exports, "red", { enumerable: true, get: function () { return red_1.red; } });
const red_colegio_1 = require("./red_colegio");
Object.defineProperty(exports, "red_colegio", { enumerable: true, get: function () { return red_colegio_1.red_colegio; } });
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
    const actividad_log = actividad_log_1.actividad_log.initModel(sequelize);
    const administrador = administrador_1.administrador.initModel(sequelize);
    const beca = beca_1.beca.initModel(sequelize);
    const beca_estado = beca_estado_1.beca_estado.initModel(sequelize);
    const beca_resolucion = beca_resolucion_1.beca_resolucion.initModel(sequelize);
    const beca_solicitud = beca_solicitud_1.beca_solicitud.initModel(sequelize);
    const colegio = colegio_1.colegio.initModel(sequelize);
    const menu = menu_1.menu.initModel(sequelize);
    const red = red_1.red.initModel(sequelize);
    const red_colegio = red_colegio_1.red_colegio.initModel(sequelize);
    const roles = roles_1.roles.initModel(sequelize);
    const tyc = tyc_1.tyc.initModel(sequelize);
    const usuario = usuario_1.usuario.initModel(sequelize);
    const zona = zona_1.zona.initModel(sequelize);
    const zona_localidad = zona_localidad_1.zona_localidad.initModel(sequelize);
    colegio.belongsToMany(red, { as: 'id_red_reds', through: red_colegio, foreignKey: "id_colegio", otherKey: "id_red" });
    red.belongsToMany(colegio, { as: 'id_colegio_colegios', through: red_colegio, foreignKey: "id_red", otherKey: "id_colegio" });
    actividad_log.belongsTo(administrador, { as: "admin", foreignKey: "admin_id" });
    administrador.hasMany(actividad_log, { as: "actividad_logs", foreignKey: "admin_id" });
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
    usuario.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio" });
    colegio.hasMany(usuario, { as: "usuarios", foreignKey: "id_colegio" });
    beca.belongsTo(red, { as: "id_red_red", foreignKey: "id_red" });
    red.hasMany(beca, { as: "becas", foreignKey: "id_red" });
    red_colegio.belongsTo(red, { as: "id_red_red", foreignKey: "id_red" });
    red.hasMany(red_colegio, { as: "red_colegios", foreignKey: "id_red" });
    administrador.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol" });
    roles.hasMany(administrador, { as: "administradors", foreignKey: "id_rol" });
    usuario.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol" });
    roles.hasMany(usuario, { as: "usuarios", foreignKey: "id_rol" });
    actividad_log.belongsTo(usuario, { as: "usuario", foreignKey: "usuario_id" });
    usuario.hasMany(actividad_log, { as: "actividad_logs", foreignKey: "usuario_id" });
    beca.belongsTo(usuario, { as: "id_usuario_usuario", foreignKey: "id_usuario" });
    usuario.hasMany(beca, { as: "becas", foreignKey: "id_usuario" });
    beca_solicitud.belongsTo(usuario, { as: "id_usuario_solic_usuario", foreignKey: "id_usuario_solic" });
    usuario.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_usuario_solic" });
    beca_solicitud.belongsTo(usuario, { as: "id_usuario_reso_usuario", foreignKey: "id_usuario_reso" });
    usuario.hasMany(beca_solicitud, { as: "id_usuario_reso_beca_solicituds", foreignKey: "id_usuario_reso" });
    beca_solicitud.belongsTo(usuario, { as: "id_usuario_baja_usuario", foreignKey: "id_usuario_baja" });
    usuario.hasMany(beca_solicitud, { as: "id_usuario_baja_beca_solicituds", foreignKey: "id_usuario_baja" });
    beca_solicitud.belongsTo(usuario, { as: "id_pariente_usuario", foreignKey: "id_pariente" });
    usuario.hasMany(beca_solicitud, { as: "id_pariente_beca_solicituds", foreignKey: "id_pariente" });
    zona_localidad.belongsTo(zona, { as: "id_zona_zona", foreignKey: "id_zona" });
    zona.hasMany(zona_localidad, { as: "zona_localidads", foreignKey: "id_zona" });
    colegio.belongsTo(zona_localidad, { as: "id_zona_zona_localidad", foreignKey: "id_zona" });
    zona_localidad.hasMany(colegio, { as: "colegios", foreignKey: "id_zona" });
    return {
        actividad_log: actividad_log,
        administrador: administrador,
        beca: beca,
        beca_estado: beca_estado,
        beca_resolucion: beca_resolucion,
        beca_solicitud: beca_solicitud,
        colegio: colegio,
        menu: menu,
        red: red,
        red_colegio: red_colegio,
        roles: roles,
        tyc: tyc,
        usuario: usuario,
        zona: zona,
        zona_localidad: zona_localidad,
    };
}

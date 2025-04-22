"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zona_localidad = exports.zona = exports.usuario = exports.tyc = exports.roles = exports.red_colegio = exports.red = exports.plan = exports.parametros = exports.notificaciones = exports.menu = exports.forma_pago = exports.colegio = exports.beca_solicitud = exports.beca_resolucion = exports.beca_estado = exports.beca_automatizacion_log = exports.beca_automatizacion_ejecucion = exports.beca = exports.autorizados = exports.administrador = exports.actividad_log = void 0;
exports.initModels = initModels;
const actividad_log_1 = require("./actividad_log");
Object.defineProperty(exports, "actividad_log", { enumerable: true, get: function () { return actividad_log_1.actividad_log; } });
const administrador_1 = require("./administrador");
Object.defineProperty(exports, "administrador", { enumerable: true, get: function () { return administrador_1.administrador; } });
const autorizados_1 = require("./autorizados");
Object.defineProperty(exports, "autorizados", { enumerable: true, get: function () { return autorizados_1.autorizados; } });
const beca_1 = require("./beca");
Object.defineProperty(exports, "beca", { enumerable: true, get: function () { return beca_1.beca; } });
const beca_automatizacion_ejecucion_1 = require("./beca_automatizacion_ejecucion");
Object.defineProperty(exports, "beca_automatizacion_ejecucion", { enumerable: true, get: function () { return beca_automatizacion_ejecucion_1.beca_automatizacion_ejecucion; } });
const beca_automatizacion_log_1 = require("./beca_automatizacion_log");
Object.defineProperty(exports, "beca_automatizacion_log", { enumerable: true, get: function () { return beca_automatizacion_log_1.beca_automatizacion_log; } });
const beca_estado_1 = require("./beca_estado");
Object.defineProperty(exports, "beca_estado", { enumerable: true, get: function () { return beca_estado_1.beca_estado; } });
const beca_resolucion_1 = require("./beca_resolucion");
Object.defineProperty(exports, "beca_resolucion", { enumerable: true, get: function () { return beca_resolucion_1.beca_resolucion; } });
const beca_solicitud_1 = require("./beca_solicitud");
Object.defineProperty(exports, "beca_solicitud", { enumerable: true, get: function () { return beca_solicitud_1.beca_solicitud; } });
const colegio_1 = require("./colegio");
Object.defineProperty(exports, "colegio", { enumerable: true, get: function () { return colegio_1.colegio; } });
const forma_pago_1 = require("./forma_pago");
Object.defineProperty(exports, "forma_pago", { enumerable: true, get: function () { return forma_pago_1.forma_pago; } });
const menu_1 = require("./menu");
Object.defineProperty(exports, "menu", { enumerable: true, get: function () { return menu_1.menu; } });
const notificaciones_1 = require("./notificaciones");
Object.defineProperty(exports, "notificaciones", { enumerable: true, get: function () { return notificaciones_1.notificaciones; } });
const parametros_1 = require("./parametros");
Object.defineProperty(exports, "parametros", { enumerable: true, get: function () { return parametros_1.parametros; } });
const plan_1 = require("./plan");
Object.defineProperty(exports, "plan", { enumerable: true, get: function () { return plan_1.plan; } });
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
    const autorizados = autorizados_1.autorizados.initModel(sequelize);
    const beca = beca_1.beca.initModel(sequelize);
    const beca_automatizacion_ejecucion = beca_automatizacion_ejecucion_1.beca_automatizacion_ejecucion.initModel(sequelize);
    const beca_automatizacion_log = beca_automatizacion_log_1.beca_automatizacion_log.initModel(sequelize);
    const beca_estado = beca_estado_1.beca_estado.initModel(sequelize);
    const beca_resolucion = beca_resolucion_1.beca_resolucion.initModel(sequelize);
    const beca_solicitud = beca_solicitud_1.beca_solicitud.initModel(sequelize);
    const colegio = colegio_1.colegio.initModel(sequelize);
    const forma_pago = forma_pago_1.forma_pago.initModel(sequelize);
    const menu = menu_1.menu.initModel(sequelize);
    const notificaciones = notificaciones_1.notificaciones.initModel(sequelize);
    const parametros = parametros_1.parametros.initModel(sequelize);
    const plan = plan_1.plan.initModel(sequelize);
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
    beca_automatizacion_log.belongsTo(beca_automatizacion_ejecucion, { as: "id_ejecucion_beca_automatizacion_ejecucion", foreignKey: "id_ejecucion" });
    beca_automatizacion_ejecucion.hasMany(beca_automatizacion_log, { as: "beca_automatizacion_logs", foreignKey: "id_ejecucion" });
    beca_solicitud.belongsTo(beca_estado, { as: "id_estado_beca_estado", foreignKey: "id_estado" });
    beca_estado.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_estado" });
    beca_solicitud.belongsTo(beca_resolucion, { as: "id_resolucion_beca_resolucion", foreignKey: "id_resolucion" });
    beca_resolucion.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_resolucion" });
    beca_automatizacion_log.belongsTo(beca_solicitud, { as: "id_beca_solicitud_beca_solicitud", foreignKey: "id_beca_solicitud" });
    beca_solicitud.hasMany(beca_automatizacion_log, { as: "beca_automatizacion_logs", foreignKey: "id_beca_solicitud" });
    notificaciones.belongsTo(beca_solicitud, { as: "id_solicitud_beca_solicitud", foreignKey: "id_solicitud" });
    beca_solicitud.hasMany(notificaciones, { as: "notificaciones", foreignKey: "id_solicitud" });
    autorizados.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio" });
    colegio.hasMany(autorizados, { as: "autorizados", foreignKey: "id_colegio" });
    beca.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio" });
    colegio.hasMany(beca, { as: "becas", foreignKey: "id_colegio" });
    beca_solicitud.belongsTo(colegio, { as: "id_colegio_solic_colegio", foreignKey: "id_colegio_solic" });
    colegio.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_colegio_solic" });
    notificaciones.belongsTo(colegio, { as: "id_colegio_ofer_colegio", foreignKey: "id_colegio_ofer" });
    colegio.hasMany(notificaciones, { as: "notificaciones", foreignKey: "id_colegio_ofer" });
    notificaciones.belongsTo(colegio, { as: "id_colegio_solic_colegio", foreignKey: "id_colegio_solic" });
    colegio.hasMany(notificaciones, { as: "id_colegio_solic_notificaciones", foreignKey: "id_colegio_solic" });
    red_colegio.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio" });
    colegio.hasMany(red_colegio, { as: "red_colegios", foreignKey: "id_colegio" });
    usuario.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio" });
    colegio.hasMany(usuario, { as: "usuarios", foreignKey: "id_colegio" });
    colegio.belongsTo(forma_pago, { as: "id_forma_pago_forma_pago", foreignKey: "id_forma_pago" });
    forma_pago.hasMany(colegio, { as: "colegios", foreignKey: "id_forma_pago" });
    colegio.belongsTo(plan, { as: "id_plan_plan", foreignKey: "id_plan" });
    plan.hasMany(colegio, { as: "colegios", foreignKey: "id_plan" });
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
        autorizados: autorizados,
        beca: beca,
        beca_automatizacion_ejecucion: beca_automatizacion_ejecucion,
        beca_automatizacion_log: beca_automatizacion_log,
        beca_estado: beca_estado,
        beca_resolucion: beca_resolucion,
        beca_solicitud: beca_solicitud,
        colegio: colegio,
        forma_pago: forma_pago,
        menu: menu,
        notificaciones: notificaciones,
        parametros: parametros,
        plan: plan,
        red: red,
        red_colegio: red_colegio,
        roles: roles,
        tyc: tyc,
        usuario: usuario,
        zona: zona,
        zona_localidad: zona_localidad,
    };
}

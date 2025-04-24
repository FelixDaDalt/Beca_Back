import type { Sequelize } from "sequelize";
import { actividad_log as _actividad_log } from "./actividad_log";
import type { actividad_logAttributes, actividad_logCreationAttributes } from "./actividad_log";
import { administrador as _administrador } from "./administrador";
import type { administradorAttributes, administradorCreationAttributes } from "./administrador";
import { autorizados as _autorizados } from "./autorizados";
import type { autorizadosAttributes, autorizadosCreationAttributes } from "./autorizados";
import { beca as _beca } from "./beca";
import type { becaAttributes, becaCreationAttributes } from "./beca";
import { beca_automatizacion_ejecucion as _beca_automatizacion_ejecucion } from "./beca_automatizacion_ejecucion";
import type { beca_automatizacion_ejecucionAttributes, beca_automatizacion_ejecucionCreationAttributes } from "./beca_automatizacion_ejecucion";
import { beca_automatizacion_log as _beca_automatizacion_log } from "./beca_automatizacion_log";
import type { beca_automatizacion_logAttributes, beca_automatizacion_logCreationAttributes } from "./beca_automatizacion_log";
import { beca_estado as _beca_estado } from "./beca_estado";
import type { beca_estadoAttributes, beca_estadoCreationAttributes } from "./beca_estado";
import { beca_resolucion as _beca_resolucion } from "./beca_resolucion";
import type { beca_resolucionAttributes, beca_resolucionCreationAttributes } from "./beca_resolucion";
import { beca_solicitud as _beca_solicitud } from "./beca_solicitud";
import type { beca_solicitudAttributes, beca_solicitudCreationAttributes } from "./beca_solicitud";
import { colegio as _colegio } from "./colegio";
import type { colegioAttributes, colegioCreationAttributes } from "./colegio";
import { forma_pago as _forma_pago } from "./forma_pago";
import type { forma_pagoAttributes, forma_pagoCreationAttributes } from "./forma_pago";
import { notificaciones as _notificaciones } from "./notificaciones";
import type { notificacionesAttributes, notificacionesCreationAttributes } from "./notificaciones";
import { parametros as _parametros } from "./parametros";
import type { parametrosAttributes, parametrosCreationAttributes } from "./parametros";
import { plan as _plan } from "./plan";
import type { planAttributes, planCreationAttributes } from "./plan";
import { red as _red } from "./red";
import type { redAttributes, redCreationAttributes } from "./red";
import { red_colegio as _red_colegio } from "./red_colegio";
import type { red_colegioAttributes, red_colegioCreationAttributes } from "./red_colegio";
import { reporte_error as _reporte_error } from "./reporte_error";
import type { reporte_errorAttributes, reporte_errorCreationAttributes } from "./reporte_error";
import { roles as _roles } from "./roles";
import type { rolesAttributes, rolesCreationAttributes } from "./roles";
import { tyc as _tyc } from "./tyc";
import type { tycAttributes, tycCreationAttributes } from "./tyc";
import { usuario as _usuario } from "./usuario";
import type { usuarioAttributes, usuarioCreationAttributes } from "./usuario";
import { zona as _zona } from "./zona";
import type { zonaAttributes, zonaCreationAttributes } from "./zona";
import { zona_localidad as _zona_localidad } from "./zona_localidad";
import type { zona_localidadAttributes, zona_localidadCreationAttributes } from "./zona_localidad";

export {
  _actividad_log as actividad_log,
  _administrador as administrador,
  _autorizados as autorizados,
  _beca as beca,
  _beca_automatizacion_ejecucion as beca_automatizacion_ejecucion,
  _beca_automatizacion_log as beca_automatizacion_log,
  _beca_estado as beca_estado,
  _beca_resolucion as beca_resolucion,
  _beca_solicitud as beca_solicitud,
  _colegio as colegio,
  _forma_pago as forma_pago,
  _notificaciones as notificaciones,
  _parametros as parametros,
  _plan as plan,
  _red as red,
  _red_colegio as red_colegio,
  _reporte_error as reporte_error,
  _roles as roles,
  _tyc as tyc,
  _usuario as usuario,
  _zona as zona,
  _zona_localidad as zona_localidad,
};

export type {
  actividad_logAttributes,
  actividad_logCreationAttributes,
  administradorAttributes,
  administradorCreationAttributes,
  autorizadosAttributes,
  autorizadosCreationAttributes,
  becaAttributes,
  becaCreationAttributes,
  beca_automatizacion_ejecucionAttributes,
  beca_automatizacion_ejecucionCreationAttributes,
  beca_automatizacion_logAttributes,
  beca_automatizacion_logCreationAttributes,
  beca_estadoAttributes,
  beca_estadoCreationAttributes,
  beca_resolucionAttributes,
  beca_resolucionCreationAttributes,
  beca_solicitudAttributes,
  beca_solicitudCreationAttributes,
  colegioAttributes,
  colegioCreationAttributes,
  forma_pagoAttributes,
  forma_pagoCreationAttributes,
  notificacionesAttributes,
  notificacionesCreationAttributes,
  parametrosAttributes,
  parametrosCreationAttributes,
  planAttributes,
  planCreationAttributes,
  redAttributes,
  redCreationAttributes,
  red_colegioAttributes,
  red_colegioCreationAttributes,
  reporte_errorAttributes,
  reporte_errorCreationAttributes,
  rolesAttributes,
  rolesCreationAttributes,
  tycAttributes,
  tycCreationAttributes,
  usuarioAttributes,
  usuarioCreationAttributes,
  zonaAttributes,
  zonaCreationAttributes,
  zona_localidadAttributes,
  zona_localidadCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const actividad_log = _actividad_log.initModel(sequelize);
  const administrador = _administrador.initModel(sequelize);
  const autorizados = _autorizados.initModel(sequelize);
  const beca = _beca.initModel(sequelize);
  const beca_automatizacion_ejecucion = _beca_automatizacion_ejecucion.initModel(sequelize);
  const beca_automatizacion_log = _beca_automatizacion_log.initModel(sequelize);
  const beca_estado = _beca_estado.initModel(sequelize);
  const beca_resolucion = _beca_resolucion.initModel(sequelize);
  const beca_solicitud = _beca_solicitud.initModel(sequelize);
  const colegio = _colegio.initModel(sequelize);
  const forma_pago = _forma_pago.initModel(sequelize);
  const notificaciones = _notificaciones.initModel(sequelize);
  const parametros = _parametros.initModel(sequelize);
  const plan = _plan.initModel(sequelize);
  const red = _red.initModel(sequelize);
  const red_colegio = _red_colegio.initModel(sequelize);
  const reporte_error = _reporte_error.initModel(sequelize);
  const roles = _roles.initModel(sequelize);
  const tyc = _tyc.initModel(sequelize);
  const usuario = _usuario.initModel(sequelize);
  const zona = _zona.initModel(sequelize);
  const zona_localidad = _zona_localidad.initModel(sequelize);

  colegio.belongsToMany(red, { as: 'id_red_reds', through: red_colegio, foreignKey: "id_colegio", otherKey: "id_red" });
  red.belongsToMany(colegio, { as: 'id_colegio_colegios', through: red_colegio, foreignKey: "id_red", otherKey: "id_colegio" });
  actividad_log.belongsTo(administrador, { as: "admin", foreignKey: "admin_id"});
  administrador.hasMany(actividad_log, { as: "actividad_logs", foreignKey: "admin_id"});
  beca_solicitud.belongsTo(autorizados, { as: "id_pariente_autorizado", foreignKey: "id_pariente"});
  autorizados.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_pariente"});
  beca_solicitud.belongsTo(beca, { as: "id_beca_beca", foreignKey: "id_beca"});
  beca.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_beca"});
  beca_automatizacion_log.belongsTo(beca_automatizacion_ejecucion, { as: "id_ejecucion_beca_automatizacion_ejecucion", foreignKey: "id_ejecucion"});
  beca_automatizacion_ejecucion.hasMany(beca_automatizacion_log, { as: "beca_automatizacion_logs", foreignKey: "id_ejecucion"});
  beca_solicitud.belongsTo(beca_estado, { as: "id_estado_beca_estado", foreignKey: "id_estado"});
  beca_estado.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_estado"});
  beca_solicitud.belongsTo(beca_resolucion, { as: "id_resolucion_beca_resolucion", foreignKey: "id_resolucion"});
  beca_resolucion.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_resolucion"});
  beca_automatizacion_log.belongsTo(beca_solicitud, { as: "id_beca_solicitud_beca_solicitud", foreignKey: "id_beca_solicitud"});
  beca_solicitud.hasMany(beca_automatizacion_log, { as: "beca_automatizacion_logs", foreignKey: "id_beca_solicitud"});
  notificaciones.belongsTo(beca_solicitud, { as: "id_solicitud_beca_solicitud", foreignKey: "id_solicitud"});
  beca_solicitud.hasMany(notificaciones, { as: "notificaciones", foreignKey: "id_solicitud"});
  autorizados.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio"});
  colegio.hasMany(autorizados, { as: "autorizados", foreignKey: "id_colegio"});
  beca.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio"});
  colegio.hasMany(beca, { as: "becas", foreignKey: "id_colegio"});
  beca_solicitud.belongsTo(colegio, { as: "id_colegio_solic_colegio", foreignKey: "id_colegio_solic"});
  colegio.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_colegio_solic"});
  notificaciones.belongsTo(colegio, { as: "id_colegio_ofer_colegio", foreignKey: "id_colegio_ofer"});
  colegio.hasMany(notificaciones, { as: "notificaciones", foreignKey: "id_colegio_ofer"});
  notificaciones.belongsTo(colegio, { as: "id_colegio_solic_colegio", foreignKey: "id_colegio_solic"});
  colegio.hasMany(notificaciones, { as: "id_colegio_solic_notificaciones", foreignKey: "id_colegio_solic"});
  red_colegio.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio"});
  colegio.hasMany(red_colegio, { as: "red_colegios", foreignKey: "id_colegio"});
  usuario.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio"});
  colegio.hasMany(usuario, { as: "usuarios", foreignKey: "id_colegio"});
  colegio.belongsTo(forma_pago, { as: "id_forma_pago_forma_pago", foreignKey: "id_forma_pago"});
  forma_pago.hasMany(colegio, { as: "colegios", foreignKey: "id_forma_pago"});
  colegio.belongsTo(plan, { as: "id_plan_plan", foreignKey: "id_plan"});
  plan.hasMany(colegio, { as: "colegios", foreignKey: "id_plan"});
  beca.belongsTo(red, { as: "id_red_red", foreignKey: "id_red"});
  red.hasMany(beca, { as: "becas", foreignKey: "id_red"});
  red_colegio.belongsTo(red, { as: "id_red_red", foreignKey: "id_red"});
  red.hasMany(red_colegio, { as: "red_colegios", foreignKey: "id_red"});
  administrador.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol"});
  roles.hasMany(administrador, { as: "administradors", foreignKey: "id_rol"});
  usuario.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol"});
  roles.hasMany(usuario, { as: "usuarios", foreignKey: "id_rol"});
  actividad_log.belongsTo(usuario, { as: "usuario", foreignKey: "usuario_id"});
  usuario.hasMany(actividad_log, { as: "actividad_logs", foreignKey: "usuario_id"});
  beca.belongsTo(usuario, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuario.hasMany(beca, { as: "becas", foreignKey: "id_usuario"});
  beca_solicitud.belongsTo(usuario, { as: "id_usuario_solic_usuario", foreignKey: "id_usuario_solic"});
  usuario.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_usuario_solic"});
  beca_solicitud.belongsTo(usuario, { as: "id_usuario_reso_usuario", foreignKey: "id_usuario_reso"});
  usuario.hasMany(beca_solicitud, { as: "id_usuario_reso_beca_solicituds", foreignKey: "id_usuario_reso"});
  beca_solicitud.belongsTo(usuario, { as: "id_usuario_baja_usuario", foreignKey: "id_usuario_baja"});
  usuario.hasMany(beca_solicitud, { as: "id_usuario_baja_beca_solicituds", foreignKey: "id_usuario_baja"});
  zona_localidad.belongsTo(zona, { as: "id_zona_zona", foreignKey: "id_zona"});
  zona.hasMany(zona_localidad, { as: "zona_localidads", foreignKey: "id_zona"});
  colegio.belongsTo(zona_localidad, { as: "id_zona_zona_localidad", foreignKey: "id_zona"});
  zona_localidad.hasMany(colegio, { as: "colegios", foreignKey: "id_zona"});

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
    notificaciones: notificaciones,
    parametros: parametros,
    plan: plan,
    red: red,
    red_colegio: red_colegio,
    reporte_error: reporte_error,
    roles: roles,
    tyc: tyc,
    usuario: usuario,
    zona: zona,
    zona_localidad: zona_localidad,
  };
}

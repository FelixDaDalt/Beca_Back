import type { Sequelize } from "sequelize";
import { administrador as _administrador } from "./administrador";
import type { administradorAttributes, administradorCreationAttributes } from "./administrador";
import { beca as _beca } from "./beca";
import type { becaAttributes, becaCreationAttributes } from "./beca";
import { beca_estado as _beca_estado } from "./beca_estado";
import type { beca_estadoAttributes, beca_estadoCreationAttributes } from "./beca_estado";
import { beca_resolucion as _beca_resolucion } from "./beca_resolucion";
import type { beca_resolucionAttributes, beca_resolucionCreationAttributes } from "./beca_resolucion";
import { beca_solicitud as _beca_solicitud } from "./beca_solicitud";
import type { beca_solicitudAttributes, beca_solicitudCreationAttributes } from "./beca_solicitud";
import { colegio as _colegio } from "./colegio";
import type { colegioAttributes, colegioCreationAttributes } from "./colegio";
import { entidad_tipo as _entidad_tipo } from "./entidad_tipo";
import type { entidad_tipoAttributes, entidad_tipoCreationAttributes } from "./entidad_tipo";
import { ingresos_administradores as _ingresos_administradores } from "./ingresos_administradores";
import type { ingresos_administradoresAttributes, ingresos_administradoresCreationAttributes } from "./ingresos_administradores";
import { ingresos_usuarios as _ingresos_usuarios } from "./ingresos_usuarios";
import type { ingresos_usuariosAttributes, ingresos_usuariosCreationAttributes } from "./ingresos_usuarios";
import { menu as _menu } from "./menu";
import type { menuAttributes, menuCreationAttributes } from "./menu";
import { red as _red } from "./red";
import type { redAttributes, redCreationAttributes } from "./red";
import { red_colegio as _red_colegio } from "./red_colegio";
import type { red_colegioAttributes, red_colegioCreationAttributes } from "./red_colegio";
import { registroeventos as _registroeventos } from "./registroeventos";
import type { registroeventosAttributes, registroeventosCreationAttributes } from "./registroeventos";
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
  _administrador as administrador,
  _beca as beca,
  _beca_estado as beca_estado,
  _beca_resolucion as beca_resolucion,
  _beca_solicitud as beca_solicitud,
  _colegio as colegio,
  _entidad_tipo as entidad_tipo,
  _ingresos_administradores as ingresos_administradores,
  _ingresos_usuarios as ingresos_usuarios,
  _menu as menu,
  _red as red,
  _red_colegio as red_colegio,
  _registroeventos as registroeventos,
  _roles as roles,
  _tyc as tyc,
  _usuario as usuario,
  _zona as zona,
  _zona_localidad as zona_localidad,
};

export type {
  administradorAttributes,
  administradorCreationAttributes,
  becaAttributes,
  becaCreationAttributes,
  beca_estadoAttributes,
  beca_estadoCreationAttributes,
  beca_resolucionAttributes,
  beca_resolucionCreationAttributes,
  beca_solicitudAttributes,
  beca_solicitudCreationAttributes,
  colegioAttributes,
  colegioCreationAttributes,
  entidad_tipoAttributes,
  entidad_tipoCreationAttributes,
  ingresos_administradoresAttributes,
  ingresos_administradoresCreationAttributes,
  ingresos_usuariosAttributes,
  ingresos_usuariosCreationAttributes,
  menuAttributes,
  menuCreationAttributes,
  redAttributes,
  redCreationAttributes,
  red_colegioAttributes,
  red_colegioCreationAttributes,
  registroeventosAttributes,
  registroeventosCreationAttributes,
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
  const administrador = _administrador.initModel(sequelize);
  const beca = _beca.initModel(sequelize);
  const beca_estado = _beca_estado.initModel(sequelize);
  const beca_resolucion = _beca_resolucion.initModel(sequelize);
  const beca_solicitud = _beca_solicitud.initModel(sequelize);
  const colegio = _colegio.initModel(sequelize);
  const entidad_tipo = _entidad_tipo.initModel(sequelize);
  const ingresos_administradores = _ingresos_administradores.initModel(sequelize);
  const ingresos_usuarios = _ingresos_usuarios.initModel(sequelize);
  const menu = _menu.initModel(sequelize);
  const red = _red.initModel(sequelize);
  const red_colegio = _red_colegio.initModel(sequelize);
  const registroeventos = _registroeventos.initModel(sequelize);
  const roles = _roles.initModel(sequelize);
  const tyc = _tyc.initModel(sequelize);
  const usuario = _usuario.initModel(sequelize);
  const zona = _zona.initModel(sequelize);
  const zona_localidad = _zona_localidad.initModel(sequelize);

  colegio.belongsToMany(red, { as: 'id_red_reds', through: red_colegio, foreignKey: "id_colegio", otherKey: "id_red" });
  red.belongsToMany(colegio, { as: 'id_colegio_colegios', through: red_colegio, foreignKey: "id_red", otherKey: "id_colegio" });
  ingresos_administradores.belongsTo(administrador, { as: "id_usuario_administrador", foreignKey: "id_usuario"});
  administrador.hasMany(ingresos_administradores, { as: "ingresos_administradores", foreignKey: "id_usuario"});
  registroeventos.belongsTo(administrador, { as: "administrador", foreignKey: "administrador_id"});
  administrador.hasMany(registroeventos, { as: "registroeventos", foreignKey: "administrador_id"});
  beca_solicitud.belongsTo(beca, { as: "id_beca_beca", foreignKey: "id_beca"});
  beca.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_beca"});
  beca_solicitud.belongsTo(beca_estado, { as: "id_estado_beca_estado", foreignKey: "id_estado"});
  beca_estado.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_estado"});
  beca_solicitud.belongsTo(beca_resolucion, { as: "id_resolucion_beca_resolucion", foreignKey: "id_resolucion"});
  beca_resolucion.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_resolucion"});
  beca.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio"});
  colegio.hasMany(beca, { as: "becas", foreignKey: "id_colegio"});
  beca_solicitud.belongsTo(colegio, { as: "id_colegio_solic_colegio", foreignKey: "id_colegio_solic"});
  colegio.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_colegio_solic"});
  red_colegio.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio"});
  colegio.hasMany(red_colegio, { as: "red_colegios", foreignKey: "id_colegio"});
  registroeventos.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio"});
  colegio.hasMany(registroeventos, { as: "registroeventos", foreignKey: "id_colegio"});
  usuario.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio"});
  colegio.hasMany(usuario, { as: "usuarios", foreignKey: "id_colegio"});
  registroeventos.belongsTo(entidad_tipo, { as: "entidad_tipo", foreignKey: "entidad_tipo_id"});
  entidad_tipo.hasMany(registroeventos, { as: "registroeventos", foreignKey: "entidad_tipo_id"});
  beca.belongsTo(red, { as: "id_red_red", foreignKey: "id_red"});
  red.hasMany(beca, { as: "becas", foreignKey: "id_red"});
  red_colegio.belongsTo(red, { as: "id_red_red", foreignKey: "id_red"});
  red.hasMany(red_colegio, { as: "red_colegios", foreignKey: "id_red"});
  administrador.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol"});
  roles.hasMany(administrador, { as: "administradors", foreignKey: "id_rol"});
  registroeventos.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol"});
  roles.hasMany(registroeventos, { as: "registroeventos", foreignKey: "id_rol"});
  usuario.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol"});
  roles.hasMany(usuario, { as: "usuarios", foreignKey: "id_rol"});
  beca.belongsTo(usuario, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuario.hasMany(beca, { as: "becas", foreignKey: "id_usuario"});
  beca_solicitud.belongsTo(usuario, { as: "id_usuario_solic_usuario", foreignKey: "id_usuario_solic"});
  usuario.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_usuario_solic"});
  beca_solicitud.belongsTo(usuario, { as: "id_usuario_reso_usuario", foreignKey: "id_usuario_reso"});
  usuario.hasMany(beca_solicitud, { as: "id_usuario_reso_beca_solicituds", foreignKey: "id_usuario_reso"});
  beca_solicitud.belongsTo(usuario, { as: "id_usuario_baja_usuario", foreignKey: "id_usuario_baja"});
  usuario.hasMany(beca_solicitud, { as: "id_usuario_baja_beca_solicituds", foreignKey: "id_usuario_baja"});
  ingresos_usuarios.belongsTo(usuario, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuario.hasMany(ingresos_usuarios, { as: "ingresos_usuarios", foreignKey: "id_usuario"});
  registroeventos.belongsTo(usuario, { as: "usuario", foreignKey: "usuario_id"});
  usuario.hasMany(registroeventos, { as: "registroeventos", foreignKey: "usuario_id"});
  zona_localidad.belongsTo(zona, { as: "id_zona_zona", foreignKey: "id_zona"});
  zona.hasMany(zona_localidad, { as: "zona_localidads", foreignKey: "id_zona"});
  colegio.belongsTo(zona_localidad, { as: "id_zona_zona_localidad", foreignKey: "id_zona"});
  zona_localidad.hasMany(colegio, { as: "colegios", foreignKey: "id_zona"});

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

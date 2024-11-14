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
import { registro_administrador as _registro_administrador } from "./registro_administrador";
import type { registro_administradorAttributes, registro_administradorCreationAttributes } from "./registro_administrador";
import { registro_autorizado as _registro_autorizado } from "./registro_autorizado";
import type { registro_autorizadoAttributes, registro_autorizadoCreationAttributes } from "./registro_autorizado";
import { registro_colegio as _registro_colegio } from "./registro_colegio";
import type { registro_colegioAttributes, registro_colegioCreationAttributes } from "./registro_colegio";
import { registro_delegado as _registro_delegado } from "./registro_delegado";
import type { registro_delegadoAttributes, registro_delegadoCreationAttributes } from "./registro_delegado";
import { registro_red as _registro_red } from "./registro_red";
import type { registro_redAttributes, registro_redCreationAttributes } from "./registro_red";
import { registro_responsable as _registro_responsable } from "./registro_responsable";
import type { registro_responsableAttributes, registro_responsableCreationAttributes } from "./registro_responsable";
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
  _ingresos_administradores as ingresos_administradores,
  _ingresos_usuarios as ingresos_usuarios,
  _menu as menu,
  _red as red,
  _red_colegio as red_colegio,
  _registro_administrador as registro_administrador,
  _registro_autorizado as registro_autorizado,
  _registro_colegio as registro_colegio,
  _registro_delegado as registro_delegado,
  _registro_red as registro_red,
  _registro_responsable as registro_responsable,
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
  registro_administradorAttributes,
  registro_administradorCreationAttributes,
  registro_autorizadoAttributes,
  registro_autorizadoCreationAttributes,
  registro_colegioAttributes,
  registro_colegioCreationAttributes,
  registro_delegadoAttributes,
  registro_delegadoCreationAttributes,
  registro_redAttributes,
  registro_redCreationAttributes,
  registro_responsableAttributes,
  registro_responsableCreationAttributes,
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
  const ingresos_administradores = _ingresos_administradores.initModel(sequelize);
  const ingresos_usuarios = _ingresos_usuarios.initModel(sequelize);
  const menu = _menu.initModel(sequelize);
  const red = _red.initModel(sequelize);
  const red_colegio = _red_colegio.initModel(sequelize);
  const registro_administrador = _registro_administrador.initModel(sequelize);
  const registro_autorizado = _registro_autorizado.initModel(sequelize);
  const registro_colegio = _registro_colegio.initModel(sequelize);
  const registro_delegado = _registro_delegado.initModel(sequelize);
  const registro_red = _registro_red.initModel(sequelize);
  const registro_responsable = _registro_responsable.initModel(sequelize);
  const roles = _roles.initModel(sequelize);
  const tyc = _tyc.initModel(sequelize);
  const usuario = _usuario.initModel(sequelize);
  const zona = _zona.initModel(sequelize);
  const zona_localidad = _zona_localidad.initModel(sequelize);

  colegio.belongsToMany(red, { as: 'id_red_reds', through: red_colegio, foreignKey: "id_colegio", otherKey: "id_red" });
  red.belongsToMany(colegio, { as: 'id_colegio_colegios', through: red_colegio, foreignKey: "id_red", otherKey: "id_colegio" });
  ingresos_administradores.belongsTo(administrador, { as: "id_usuario_administrador", foreignKey: "id_usuario"});
  administrador.hasMany(ingresos_administradores, { as: "ingresos_administradores", foreignKey: "id_usuario"});
  registro_administrador.belongsTo(administrador, { as: "id_usuario_administrador", foreignKey: "id_usuario"});
  administrador.hasMany(registro_administrador, { as: "registro_administradors", foreignKey: "id_usuario"});
  beca_solicitud.belongsTo(beca, { as: "id_beca_beca", foreignKey: "id_beca"});
  beca.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_beca"});
  beca.belongsTo(beca_estado, { as: "id_estado_beca_estado", foreignKey: "id_estado"});
  beca_estado.hasMany(beca, { as: "becas", foreignKey: "id_estado"});
  beca_solicitud.belongsTo(beca_resolucion, { as: "id_resolucion_beca_resolucion", foreignKey: "id_resolucion"});
  beca_resolucion.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_resolucion"});
  beca_solicitud.belongsTo(colegio, { as: "id_colegio_solic_colegio", foreignKey: "id_colegio_solic"});
  colegio.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_colegio_solic"});
  red_colegio.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio"});
  colegio.hasMany(red_colegio, { as: "red_colegios", foreignKey: "id_colegio"});
  registro_colegio.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio"});
  colegio.hasMany(registro_colegio, { as: "registro_colegios", foreignKey: "id_colegio"});
  usuario.belongsTo(colegio, { as: "id_colegio_colegio", foreignKey: "id_colegio"});
  colegio.hasMany(usuario, { as: "usuarios", foreignKey: "id_colegio"});
  beca.belongsTo(red, { as: "id_red_red", foreignKey: "id_red"});
  red.hasMany(beca, { as: "becas", foreignKey: "id_red"});
  red_colegio.belongsTo(red, { as: "id_red_red", foreignKey: "id_red"});
  red.hasMany(red_colegio, { as: "red_colegios", foreignKey: "id_red"});
  registro_red.belongsTo(red, { as: "id_red_red", foreignKey: "id_red"});
  red.hasMany(registro_red, { as: "registro_reds", foreignKey: "id_red"});
  administrador.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol"});
  roles.hasMany(administrador, { as: "administradors", foreignKey: "id_rol"});
  usuario.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol"});
  roles.hasMany(usuario, { as: "usuarios", foreignKey: "id_rol"});
  beca_solicitud.belongsTo(usuario, { as: "id_usuario_solic_usuario", foreignKey: "id_usuario_solic"});
  usuario.hasMany(beca_solicitud, { as: "beca_solicituds", foreignKey: "id_usuario_solic"});
  beca_solicitud.belongsTo(usuario, { as: "id_usuario_reso_usuario", foreignKey: "id_usuario_reso"});
  usuario.hasMany(beca_solicitud, { as: "id_usuario_reso_beca_solicituds", foreignKey: "id_usuario_reso"});
  ingresos_usuarios.belongsTo(usuario, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuario.hasMany(ingresos_usuarios, { as: "ingresos_usuarios", foreignKey: "id_usuario"});
  registro_autorizado.belongsTo(usuario, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuario.hasMany(registro_autorizado, { as: "registro_autorizados", foreignKey: "id_usuario"});
  registro_delegado.belongsTo(usuario, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuario.hasMany(registro_delegado, { as: "registro_delegados", foreignKey: "id_usuario"});
  registro_responsable.belongsTo(usuario, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuario.hasMany(registro_responsable, { as: "registro_responsables", foreignKey: "id_usuario"});
  zona_localidad.belongsTo(zona, { as: "zona", foreignKey: "id_zona"});
  zona.hasMany(zona_localidad, { as: "zona_localidad", foreignKey: "id_zona"});
  colegio.belongsTo(zona_localidad, { as: "zona_localidad", foreignKey: "id_zona"});
  zona_localidad.hasMany(colegio, { as: "colegios", foreignKey: "id_zona"});

  return {
    administrador: administrador,
    beca: beca,
    beca_estado: beca_estado,
    beca_resolucion: beca_resolucion,
    beca_solicitud: beca_solicitud,
    colegio: colegio,
    ingresos_administradores: ingresos_administradores,
    ingresos_usuarios: ingresos_usuarios,
    menu: menu,
    red: red,
    red_colegio: red_colegio,
    registro_administrador: registro_administrador,
    registro_autorizado: registro_autorizado,
    registro_colegio: registro_colegio,
    registro_delegado: registro_delegado,
    registro_red: registro_red,
    registro_responsable: registro_responsable,
    roles: roles,
    tyc: tyc,
    usuario: usuario,
    zona: zona,
    zona_localidad: zona_localidad,
  };
}

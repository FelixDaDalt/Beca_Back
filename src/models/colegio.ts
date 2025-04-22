import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { autorizados, autorizadosId } from './autorizados';
import type { beca, becaId } from './beca';
import type { beca_solicitud, beca_solicitudId } from './beca_solicitud';
import type { forma_pago, forma_pagoId } from './forma_pago';
import type { notificaciones, notificacionesId } from './notificaciones';
import type { plan, planId } from './plan';
import type { red, redId } from './red';
import type { red_colegio, red_colegioId } from './red_colegio';
import type { usuario, usuarioId } from './usuario';
import type { zona_localidad, zona_localidadId } from './zona_localidad';

export interface colegioAttributes {
  id: number;
  cuit: string;
  nombre: string;
  direccion_calle: string;
  direccion_numero: string;
  localidad: string;
  provincia: string;
  cp: string;
  id_zona: number;
  telefono: string;
  email?: string;
  suspendido?: number;
  borrado?: number;
  foto?: string;
  id_plan: number;
  id_forma_pago: number;
}

export type colegioPk = "id";
export type colegioId = colegio[colegioPk];
export type colegioOptionalAttributes = "id" | "email" | "suspendido" | "borrado" | "foto" | "id_plan" | "id_forma_pago";
export type colegioCreationAttributes = Optional<colegioAttributes, colegioOptionalAttributes>;

export class colegio extends Model<colegioAttributes, colegioCreationAttributes> implements colegioAttributes {
  id!: number;
  cuit!: string;
  nombre!: string;
  direccion_calle!: string;
  direccion_numero!: string;
  localidad!: string;
  provincia!: string;
  cp!: string;
  id_zona!: number;
  telefono!: string;
  email?: string;
  suspendido?: number;
  borrado?: number;
  foto?: string;
  id_plan!: number;
  id_forma_pago!: number;

  // colegio hasMany autorizados via id_colegio
  autorizados!: autorizados[];
  getAutorizados!: Sequelize.HasManyGetAssociationsMixin<autorizados>;
  setAutorizados!: Sequelize.HasManySetAssociationsMixin<autorizados, autorizadosId>;
  addAutorizado!: Sequelize.HasManyAddAssociationMixin<autorizados, autorizadosId>;
  addAutorizados!: Sequelize.HasManyAddAssociationsMixin<autorizados, autorizadosId>;
  createAutorizado!: Sequelize.HasManyCreateAssociationMixin<autorizados>;
  removeAutorizado!: Sequelize.HasManyRemoveAssociationMixin<autorizados, autorizadosId>;
  removeAutorizados!: Sequelize.HasManyRemoveAssociationsMixin<autorizados, autorizadosId>;
  hasAutorizado!: Sequelize.HasManyHasAssociationMixin<autorizados, autorizadosId>;
  hasAutorizados!: Sequelize.HasManyHasAssociationsMixin<autorizados, autorizadosId>;
  countAutorizados!: Sequelize.HasManyCountAssociationsMixin;
  // colegio hasMany beca via id_colegio
  becas!: beca[];
  getBecas!: Sequelize.HasManyGetAssociationsMixin<beca>;
  setBecas!: Sequelize.HasManySetAssociationsMixin<beca, becaId>;
  addBeca!: Sequelize.HasManyAddAssociationMixin<beca, becaId>;
  addBecas!: Sequelize.HasManyAddAssociationsMixin<beca, becaId>;
  createBeca!: Sequelize.HasManyCreateAssociationMixin<beca>;
  removeBeca!: Sequelize.HasManyRemoveAssociationMixin<beca, becaId>;
  removeBecas!: Sequelize.HasManyRemoveAssociationsMixin<beca, becaId>;
  hasBeca!: Sequelize.HasManyHasAssociationMixin<beca, becaId>;
  hasBecas!: Sequelize.HasManyHasAssociationsMixin<beca, becaId>;
  countBecas!: Sequelize.HasManyCountAssociationsMixin;
  // colegio hasMany beca_solicitud via id_colegio_solic
  beca_solicituds!: beca_solicitud[];
  getBeca_solicituds!: Sequelize.HasManyGetAssociationsMixin<beca_solicitud>;
  setBeca_solicituds!: Sequelize.HasManySetAssociationsMixin<beca_solicitud, beca_solicitudId>;
  addBeca_solicitud!: Sequelize.HasManyAddAssociationMixin<beca_solicitud, beca_solicitudId>;
  addBeca_solicituds!: Sequelize.HasManyAddAssociationsMixin<beca_solicitud, beca_solicitudId>;
  createBeca_solicitud!: Sequelize.HasManyCreateAssociationMixin<beca_solicitud>;
  removeBeca_solicitud!: Sequelize.HasManyRemoveAssociationMixin<beca_solicitud, beca_solicitudId>;
  removeBeca_solicituds!: Sequelize.HasManyRemoveAssociationsMixin<beca_solicitud, beca_solicitudId>;
  hasBeca_solicitud!: Sequelize.HasManyHasAssociationMixin<beca_solicitud, beca_solicitudId>;
  hasBeca_solicituds!: Sequelize.HasManyHasAssociationsMixin<beca_solicitud, beca_solicitudId>;
  countBeca_solicituds!: Sequelize.HasManyCountAssociationsMixin;
  // colegio hasMany notificaciones via id_colegio_ofer
  notificaciones!: notificaciones[];
  getNotificaciones!: Sequelize.HasManyGetAssociationsMixin<notificaciones>;
  setNotificaciones!: Sequelize.HasManySetAssociationsMixin<notificaciones, notificacionesId>;
  addNotificacione!: Sequelize.HasManyAddAssociationMixin<notificaciones, notificacionesId>;
  addNotificaciones!: Sequelize.HasManyAddAssociationsMixin<notificaciones, notificacionesId>;
  createNotificacione!: Sequelize.HasManyCreateAssociationMixin<notificaciones>;
  removeNotificacione!: Sequelize.HasManyRemoveAssociationMixin<notificaciones, notificacionesId>;
  removeNotificaciones!: Sequelize.HasManyRemoveAssociationsMixin<notificaciones, notificacionesId>;
  hasNotificacione!: Sequelize.HasManyHasAssociationMixin<notificaciones, notificacionesId>;
  hasNotificaciones!: Sequelize.HasManyHasAssociationsMixin<notificaciones, notificacionesId>;
  countNotificaciones!: Sequelize.HasManyCountAssociationsMixin;
  // colegio hasMany notificaciones via id_colegio_solic
  id_colegio_solic_notificaciones!: notificaciones[];
  getId_colegio_solic_notificaciones!: Sequelize.HasManyGetAssociationsMixin<notificaciones>;
  setId_colegio_solic_notificaciones!: Sequelize.HasManySetAssociationsMixin<notificaciones, notificacionesId>;
  addId_colegio_solic_notificacione!: Sequelize.HasManyAddAssociationMixin<notificaciones, notificacionesId>;
  addId_colegio_solic_notificaciones!: Sequelize.HasManyAddAssociationsMixin<notificaciones, notificacionesId>;
  createId_colegio_solic_notificacione!: Sequelize.HasManyCreateAssociationMixin<notificaciones>;
  removeId_colegio_solic_notificacione!: Sequelize.HasManyRemoveAssociationMixin<notificaciones, notificacionesId>;
  removeId_colegio_solic_notificaciones!: Sequelize.HasManyRemoveAssociationsMixin<notificaciones, notificacionesId>;
  hasId_colegio_solic_notificacione!: Sequelize.HasManyHasAssociationMixin<notificaciones, notificacionesId>;
  hasId_colegio_solic_notificaciones!: Sequelize.HasManyHasAssociationsMixin<notificaciones, notificacionesId>;
  countId_colegio_solic_notificaciones!: Sequelize.HasManyCountAssociationsMixin;
  // colegio belongsToMany red via id_colegio and id_red
  id_red_reds!: red[];
  getId_red_reds!: Sequelize.BelongsToManyGetAssociationsMixin<red>;
  setId_red_reds!: Sequelize.BelongsToManySetAssociationsMixin<red, redId>;
  addId_red_red!: Sequelize.BelongsToManyAddAssociationMixin<red, redId>;
  addId_red_reds!: Sequelize.BelongsToManyAddAssociationsMixin<red, redId>;
  createId_red_red!: Sequelize.BelongsToManyCreateAssociationMixin<red>;
  removeId_red_red!: Sequelize.BelongsToManyRemoveAssociationMixin<red, redId>;
  removeId_red_reds!: Sequelize.BelongsToManyRemoveAssociationsMixin<red, redId>;
  hasId_red_red!: Sequelize.BelongsToManyHasAssociationMixin<red, redId>;
  hasId_red_reds!: Sequelize.BelongsToManyHasAssociationsMixin<red, redId>;
  countId_red_reds!: Sequelize.BelongsToManyCountAssociationsMixin;
  // colegio hasMany red_colegio via id_colegio
  red_colegios!: red_colegio[];
  getRed_colegios!: Sequelize.HasManyGetAssociationsMixin<red_colegio>;
  setRed_colegios!: Sequelize.HasManySetAssociationsMixin<red_colegio, red_colegioId>;
  addRed_colegio!: Sequelize.HasManyAddAssociationMixin<red_colegio, red_colegioId>;
  addRed_colegios!: Sequelize.HasManyAddAssociationsMixin<red_colegio, red_colegioId>;
  createRed_colegio!: Sequelize.HasManyCreateAssociationMixin<red_colegio>;
  removeRed_colegio!: Sequelize.HasManyRemoveAssociationMixin<red_colegio, red_colegioId>;
  removeRed_colegios!: Sequelize.HasManyRemoveAssociationsMixin<red_colegio, red_colegioId>;
  hasRed_colegio!: Sequelize.HasManyHasAssociationMixin<red_colegio, red_colegioId>;
  hasRed_colegios!: Sequelize.HasManyHasAssociationsMixin<red_colegio, red_colegioId>;
  countRed_colegios!: Sequelize.HasManyCountAssociationsMixin;
  // colegio hasMany usuario via id_colegio
  usuarios!: usuario[];
  getUsuarios!: Sequelize.HasManyGetAssociationsMixin<usuario>;
  setUsuarios!: Sequelize.HasManySetAssociationsMixin<usuario, usuarioId>;
  addUsuario!: Sequelize.HasManyAddAssociationMixin<usuario, usuarioId>;
  addUsuarios!: Sequelize.HasManyAddAssociationsMixin<usuario, usuarioId>;
  createUsuario!: Sequelize.HasManyCreateAssociationMixin<usuario>;
  removeUsuario!: Sequelize.HasManyRemoveAssociationMixin<usuario, usuarioId>;
  removeUsuarios!: Sequelize.HasManyRemoveAssociationsMixin<usuario, usuarioId>;
  hasUsuario!: Sequelize.HasManyHasAssociationMixin<usuario, usuarioId>;
  hasUsuarios!: Sequelize.HasManyHasAssociationsMixin<usuario, usuarioId>;
  countUsuarios!: Sequelize.HasManyCountAssociationsMixin;
  // colegio belongsTo forma_pago via id_forma_pago
  id_forma_pago_forma_pago!: forma_pago;
  getId_forma_pago_forma_pago!: Sequelize.BelongsToGetAssociationMixin<forma_pago>;
  setId_forma_pago_forma_pago!: Sequelize.BelongsToSetAssociationMixin<forma_pago, forma_pagoId>;
  createId_forma_pago_forma_pago!: Sequelize.BelongsToCreateAssociationMixin<forma_pago>;
  // colegio belongsTo plan via id_plan
  id_plan_plan!: plan;
  getId_plan_plan!: Sequelize.BelongsToGetAssociationMixin<plan>;
  setId_plan_plan!: Sequelize.BelongsToSetAssociationMixin<plan, planId>;
  createId_plan_plan!: Sequelize.BelongsToCreateAssociationMixin<plan>;
  // colegio belongsTo zona_localidad via id_zona
  id_zona_zona_localidad!: zona_localidad;
  getId_zona_zona_localidad!: Sequelize.BelongsToGetAssociationMixin<zona_localidad>;
  setId_zona_zona_localidad!: Sequelize.BelongsToSetAssociationMixin<zona_localidad, zona_localidadId>;
  createId_zona_zona_localidad!: Sequelize.BelongsToCreateAssociationMixin<zona_localidad>;

  static initModel(sequelize: Sequelize.Sequelize): typeof colegio {
    return colegio.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cuit: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    direccion_calle: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    direccion_numero: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    localidad: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    provincia: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cp: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    id_zona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'zona_localidad',
        key: 'id'
      }
    },
    telefono: {
      type: DataTypes.STRING(18),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "No Definido"
    },
    suspendido: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    borrado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "\/uploads\/colegio\/default.png"
    },
    id_plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1,
      references: {
        model: 'plan',
        key: 'id'
      }
    },
    id_forma_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1,
      references: {
        model: 'forma_pago',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'colegio',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_colegio_zona_localidad",
        using: "BTREE",
        fields: [
          { name: "id_zona" },
        ]
      },
      {
        name: "fk_colegio_plan",
        using: "BTREE",
        fields: [
          { name: "id_plan" },
        ]
      },
      {
        name: "fk_colegio_forma_pago",
        using: "BTREE",
        fields: [
          { name: "id_forma_pago" },
        ]
      },
    ]
  });
  }
}

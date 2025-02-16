import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { actividad_log, actividad_logId } from './actividad_log';
import type { beca, becaId } from './beca';
import type { beca_solicitud, beca_solicitudId } from './beca_solicitud';
import type { colegio, colegioId } from './colegio';
import type { roles, rolesId } from './roles';

export interface usuarioAttributes {
  id: number;
  id_colegio: number;
  id_rol: number;
  dni: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  celular?: string;
  email?: string;
  cambiarPass?: number;
  tyc?: number;
  suspendido?: number;
  borrado?: number;
  foto?: string;
}

export type usuarioPk = "id";
export type usuarioId = usuario[usuarioPk];
export type usuarioOptionalAttributes = "id" | "telefono" | "celular" | "email" | "cambiarPass" | "tyc" | "suspendido" | "borrado" | "foto";
export type usuarioCreationAttributes = Optional<usuarioAttributes, usuarioOptionalAttributes>;

export class usuario extends Model<usuarioAttributes, usuarioCreationAttributes> implements usuarioAttributes {
  id!: number;
  id_colegio!: number;
  id_rol!: number;
  dni!: string;
  password!: string;
  nombre!: string;
  apellido!: string;
  telefono?: string;
  celular?: string;
  email?: string;
  cambiarPass?: number;
  tyc?: number;
  suspendido?: number;
  borrado?: number;
  foto?: string;

  // usuario belongsTo colegio via id_colegio
  id_colegio_colegio!: colegio;
  getId_colegio_colegio!: Sequelize.BelongsToGetAssociationMixin<colegio>;
  setId_colegio_colegio!: Sequelize.BelongsToSetAssociationMixin<colegio, colegioId>;
  createId_colegio_colegio!: Sequelize.BelongsToCreateAssociationMixin<colegio>;
  // usuario belongsTo roles via id_rol
  id_rol_role!: roles;
  getId_rol_role!: Sequelize.BelongsToGetAssociationMixin<roles>;
  setId_rol_role!: Sequelize.BelongsToSetAssociationMixin<roles, rolesId>;
  createId_rol_role!: Sequelize.BelongsToCreateAssociationMixin<roles>;
  // usuario hasMany actividad_log via usuario_id
  actividad_logs!: actividad_log[];
  getActividad_logs!: Sequelize.HasManyGetAssociationsMixin<actividad_log>;
  setActividad_logs!: Sequelize.HasManySetAssociationsMixin<actividad_log, actividad_logId>;
  addActividad_log!: Sequelize.HasManyAddAssociationMixin<actividad_log, actividad_logId>;
  addActividad_logs!: Sequelize.HasManyAddAssociationsMixin<actividad_log, actividad_logId>;
  createActividad_log!: Sequelize.HasManyCreateAssociationMixin<actividad_log>;
  removeActividad_log!: Sequelize.HasManyRemoveAssociationMixin<actividad_log, actividad_logId>;
  removeActividad_logs!: Sequelize.HasManyRemoveAssociationsMixin<actividad_log, actividad_logId>;
  hasActividad_log!: Sequelize.HasManyHasAssociationMixin<actividad_log, actividad_logId>;
  hasActividad_logs!: Sequelize.HasManyHasAssociationsMixin<actividad_log, actividad_logId>;
  countActividad_logs!: Sequelize.HasManyCountAssociationsMixin;
  // usuario hasMany beca via id_usuario
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
  // usuario hasMany beca_solicitud via id_usuario_solic
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
  // usuario hasMany beca_solicitud via id_usuario_reso
  id_usuario_reso_beca_solicituds!: beca_solicitud[];
  getId_usuario_reso_beca_solicituds!: Sequelize.HasManyGetAssociationsMixin<beca_solicitud>;
  setId_usuario_reso_beca_solicituds!: Sequelize.HasManySetAssociationsMixin<beca_solicitud, beca_solicitudId>;
  addId_usuario_reso_beca_solicitud!: Sequelize.HasManyAddAssociationMixin<beca_solicitud, beca_solicitudId>;
  addId_usuario_reso_beca_solicituds!: Sequelize.HasManyAddAssociationsMixin<beca_solicitud, beca_solicitudId>;
  createId_usuario_reso_beca_solicitud!: Sequelize.HasManyCreateAssociationMixin<beca_solicitud>;
  removeId_usuario_reso_beca_solicitud!: Sequelize.HasManyRemoveAssociationMixin<beca_solicitud, beca_solicitudId>;
  removeId_usuario_reso_beca_solicituds!: Sequelize.HasManyRemoveAssociationsMixin<beca_solicitud, beca_solicitudId>;
  hasId_usuario_reso_beca_solicitud!: Sequelize.HasManyHasAssociationMixin<beca_solicitud, beca_solicitudId>;
  hasId_usuario_reso_beca_solicituds!: Sequelize.HasManyHasAssociationsMixin<beca_solicitud, beca_solicitudId>;
  countId_usuario_reso_beca_solicituds!: Sequelize.HasManyCountAssociationsMixin;
  // usuario hasMany beca_solicitud via id_usuario_baja
  id_usuario_baja_beca_solicituds!: beca_solicitud[];
  getId_usuario_baja_beca_solicituds!: Sequelize.HasManyGetAssociationsMixin<beca_solicitud>;
  setId_usuario_baja_beca_solicituds!: Sequelize.HasManySetAssociationsMixin<beca_solicitud, beca_solicitudId>;
  addId_usuario_baja_beca_solicitud!: Sequelize.HasManyAddAssociationMixin<beca_solicitud, beca_solicitudId>;
  addId_usuario_baja_beca_solicituds!: Sequelize.HasManyAddAssociationsMixin<beca_solicitud, beca_solicitudId>;
  createId_usuario_baja_beca_solicitud!: Sequelize.HasManyCreateAssociationMixin<beca_solicitud>;
  removeId_usuario_baja_beca_solicitud!: Sequelize.HasManyRemoveAssociationMixin<beca_solicitud, beca_solicitudId>;
  removeId_usuario_baja_beca_solicituds!: Sequelize.HasManyRemoveAssociationsMixin<beca_solicitud, beca_solicitudId>;
  hasId_usuario_baja_beca_solicitud!: Sequelize.HasManyHasAssociationMixin<beca_solicitud, beca_solicitudId>;
  hasId_usuario_baja_beca_solicituds!: Sequelize.HasManyHasAssociationsMixin<beca_solicitud, beca_solicitudId>;
  countId_usuario_baja_beca_solicituds!: Sequelize.HasManyCountAssociationsMixin;
  // usuario hasMany beca_solicitud via id_pariente
  id_pariente_beca_solicituds!: beca_solicitud[];
  getId_pariente_beca_solicituds!: Sequelize.HasManyGetAssociationsMixin<beca_solicitud>;
  setId_pariente_beca_solicituds!: Sequelize.HasManySetAssociationsMixin<beca_solicitud, beca_solicitudId>;
  addId_pariente_beca_solicitud!: Sequelize.HasManyAddAssociationMixin<beca_solicitud, beca_solicitudId>;
  addId_pariente_beca_solicituds!: Sequelize.HasManyAddAssociationsMixin<beca_solicitud, beca_solicitudId>;
  createId_pariente_beca_solicitud!: Sequelize.HasManyCreateAssociationMixin<beca_solicitud>;
  removeId_pariente_beca_solicitud!: Sequelize.HasManyRemoveAssociationMixin<beca_solicitud, beca_solicitudId>;
  removeId_pariente_beca_solicituds!: Sequelize.HasManyRemoveAssociationsMixin<beca_solicitud, beca_solicitudId>;
  hasId_pariente_beca_solicitud!: Sequelize.HasManyHasAssociationMixin<beca_solicitud, beca_solicitudId>;
  hasId_pariente_beca_solicituds!: Sequelize.HasManyHasAssociationsMixin<beca_solicitud, beca_solicitudId>;
  countId_pariente_beca_solicituds!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof usuario {
    return usuario.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_colegio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colegio',
        key: 'id'
      }
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    dni: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(18),
      allowNull: true,
      defaultValue: "No Definido"
    },
    celular: {
      type: DataTypes.STRING(18),
      allowNull: true,
      defaultValue: "No Definido"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "No Definido"
    },
    cambiarPass: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    tyc: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
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
      defaultValue: "\/uploads\/avatar\/default.png"
    }
  }, {
    sequelize,
    tableName: 'usuario',
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
        name: "usuario_a_colegio",
        using: "BTREE",
        fields: [
          { name: "id_colegio" },
        ]
      },
      {
        name: "usuario_a_roles",
        using: "BTREE",
        fields: [
          { name: "id_rol" },
        ]
      },
    ]
  });
  }
}

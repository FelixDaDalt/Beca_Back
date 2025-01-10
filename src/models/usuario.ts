import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { beca, becaId } from './beca';
import type { beca_solicitud, beca_solicitudId } from './beca_solicitud';
import type { colegio, colegioId } from './colegio';
import type { ingresos_usuarios, ingresos_usuariosId } from './ingresos_usuarios';
import type { registroeventos, registroeventosId } from './registroeventos';
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
  // usuario hasMany ingresos_usuarios via id_usuario
  ingresos_usuarios!: ingresos_usuarios[];
  getIngresos_usuarios!: Sequelize.HasManyGetAssociationsMixin<ingresos_usuarios>;
  setIngresos_usuarios!: Sequelize.HasManySetAssociationsMixin<ingresos_usuarios, ingresos_usuariosId>;
  addIngresos_usuario!: Sequelize.HasManyAddAssociationMixin<ingresos_usuarios, ingresos_usuariosId>;
  addIngresos_usuarios!: Sequelize.HasManyAddAssociationsMixin<ingresos_usuarios, ingresos_usuariosId>;
  createIngresos_usuario!: Sequelize.HasManyCreateAssociationMixin<ingresos_usuarios>;
  removeIngresos_usuario!: Sequelize.HasManyRemoveAssociationMixin<ingresos_usuarios, ingresos_usuariosId>;
  removeIngresos_usuarios!: Sequelize.HasManyRemoveAssociationsMixin<ingresos_usuarios, ingresos_usuariosId>;
  hasIngresos_usuario!: Sequelize.HasManyHasAssociationMixin<ingresos_usuarios, ingresos_usuariosId>;
  hasIngresos_usuarios!: Sequelize.HasManyHasAssociationsMixin<ingresos_usuarios, ingresos_usuariosId>;
  countIngresos_usuarios!: Sequelize.HasManyCountAssociationsMixin;
  // usuario hasMany registroeventos via usuario_id
  registroeventos!: registroeventos[];
  getRegistroeventos!: Sequelize.HasManyGetAssociationsMixin<registroeventos>;
  setRegistroeventos!: Sequelize.HasManySetAssociationsMixin<registroeventos, registroeventosId>;
  addRegistroevento!: Sequelize.HasManyAddAssociationMixin<registroeventos, registroeventosId>;
  addRegistroeventos!: Sequelize.HasManyAddAssociationsMixin<registroeventos, registroeventosId>;
  createRegistroevento!: Sequelize.HasManyCreateAssociationMixin<registroeventos>;
  removeRegistroevento!: Sequelize.HasManyRemoveAssociationMixin<registroeventos, registroeventosId>;
  removeRegistroeventos!: Sequelize.HasManyRemoveAssociationsMixin<registroeventos, registroeventosId>;
  hasRegistroevento!: Sequelize.HasManyHasAssociationMixin<registroeventos, registroeventosId>;
  hasRegistroeventos!: Sequelize.HasManyHasAssociationsMixin<registroeventos, registroeventosId>;
  countRegistroeventos!: Sequelize.HasManyCountAssociationsMixin;

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

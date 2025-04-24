import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { actividad_log, actividad_logId } from './actividad_log';
import type { roles, rolesId } from './roles';

export interface administradorAttributes {
  id: number;
  dni: string;
  password: string;
  nombre: string;
  apellido: string;
  celular: string;
  telefono: string;
  id_rol: number;
  cambiarPass?: number;
  suspendido?: number;
  borrado?: number;
  foto?: string;
  email: string;
  superAdmin: number;
}

export type administradorPk = "id";
export type administradorId = administrador[administradorPk];
export type administradorOptionalAttributes = "id" | "celular" | "telefono" | "id_rol" | "cambiarPass" | "suspendido" | "borrado" | "foto" | "email" | "superAdmin";
export type administradorCreationAttributes = Optional<administradorAttributes, administradorOptionalAttributes>;

export class administrador extends Model<administradorAttributes, administradorCreationAttributes> implements administradorAttributes {
  id!: number;
  dni!: string;
  password!: string;
  nombre!: string;
  apellido!: string;
  celular!: string;
  telefono!: string;
  id_rol!: number;
  cambiarPass?: number;
  suspendido?: number;
  borrado?: number;
  foto?: string;
  email!: string;
  superAdmin!: number;

  // administrador hasMany actividad_log via admin_id
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
  // administrador belongsTo roles via id_rol
  id_rol_role!: roles;
  getId_rol_role!: Sequelize.BelongsToGetAssociationMixin<roles>;
  setId_rol_role!: Sequelize.BelongsToSetAssociationMixin<roles, rolesId>;
  createId_rol_role!: Sequelize.BelongsToCreateAssociationMixin<roles>;

  static initModel(sequelize: Sequelize.Sequelize): typeof administrador {
    return administrador.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dni: {
      type: DataTypes.STRING(255),
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
    celular: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "No Definido"
    },
    telefono: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "No Definido"
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    cambiarPass: {
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
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "No Definido"
    },
    superAdmin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'administrador',
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
        name: "administrador_a_roles",
        using: "BTREE",
        fields: [
          { name: "id_rol" },
        ]
      },
    ]
  });
  }
}

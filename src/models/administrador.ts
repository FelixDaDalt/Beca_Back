import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ingresos_administradores, ingresos_administradoresId } from './ingresos_administradores';
import type { registroeventos, registroeventosId } from './registroeventos';
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
}

export type administradorPk = "id";
export type administradorId = administrador[administradorPk];
export type administradorOptionalAttributes = "id" | "celular" | "telefono" | "id_rol" | "cambiarPass" | "suspendido" | "borrado" | "foto" | "email";
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

  // administrador hasMany ingresos_administradores via id_usuario
  ingresos_administradores!: ingresos_administradores[];
  getIngresos_administradores!: Sequelize.HasManyGetAssociationsMixin<ingresos_administradores>;
  setIngresos_administradores!: Sequelize.HasManySetAssociationsMixin<ingresos_administradores, ingresos_administradoresId>;
  addIngresos_administradore!: Sequelize.HasManyAddAssociationMixin<ingresos_administradores, ingresos_administradoresId>;
  addIngresos_administradores!: Sequelize.HasManyAddAssociationsMixin<ingresos_administradores, ingresos_administradoresId>;
  createIngresos_administradore!: Sequelize.HasManyCreateAssociationMixin<ingresos_administradores>;
  removeIngresos_administradore!: Sequelize.HasManyRemoveAssociationMixin<ingresos_administradores, ingresos_administradoresId>;
  removeIngresos_administradores!: Sequelize.HasManyRemoveAssociationsMixin<ingresos_administradores, ingresos_administradoresId>;
  hasIngresos_administradore!: Sequelize.HasManyHasAssociationMixin<ingresos_administradores, ingresos_administradoresId>;
  hasIngresos_administradores!: Sequelize.HasManyHasAssociationsMixin<ingresos_administradores, ingresos_administradoresId>;
  countIngresos_administradores!: Sequelize.HasManyCountAssociationsMixin;
  // administrador hasMany registroeventos via administrador_id
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

import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { colegio, colegioId } from './colegio';

export interface responsablesAttributes {
  id: number;
  id_colegio: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  celular?: string;
  email?: string;
}

export type responsablesPk = "id";
export type responsablesId = responsables[responsablesPk];
export type responsablesOptionalAttributes = "id" | "telefono" | "celular" | "email";
export type responsablesCreationAttributes = Optional<responsablesAttributes, responsablesOptionalAttributes>;

export class responsables extends Model<responsablesAttributes, responsablesCreationAttributes> implements responsablesAttributes {
  id!: number;
  id_colegio!: number;
  nombre!: string;
  apellido!: string;
  dni!: string;
  telefono?: string;
  celular?: string;
  email?: string;

  // responsables belongsTo colegio via id_colegio
  id_colegio_colegio!: colegio;
  getId_colegio_colegio!: Sequelize.BelongsToGetAssociationMixin<colegio>;
  setId_colegio_colegio!: Sequelize.BelongsToSetAssociationMixin<colegio, colegioId>;
  createId_colegio_colegio!: Sequelize.BelongsToCreateAssociationMixin<colegio>;

  static initModel(sequelize: Sequelize.Sequelize): typeof responsables {
    return responsables.init({
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
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    dni: {
      type: DataTypes.STRING(10),
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
    }
  }, {
    sequelize,
    tableName: 'responsables',
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
        name: "fk_responsables_colegio",
        using: "BTREE",
        fields: [
          { name: "id_colegio" },
        ]
      },
    ]
  });
  }
}

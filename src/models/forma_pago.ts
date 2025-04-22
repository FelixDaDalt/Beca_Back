import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { colegio, colegioId } from './colegio';

export interface forma_pagoAttributes {
  id: number;
  identificador: string;
  nombre: string;
  descuento: number;
  editable?: number;
  borrado?: number;
}

export type forma_pagoPk = "id";
export type forma_pagoId = forma_pago[forma_pagoPk];
export type forma_pagoOptionalAttributes = "id" | "editable" | "borrado";
export type forma_pagoCreationAttributes = Optional<forma_pagoAttributes, forma_pagoOptionalAttributes>;

export class forma_pago extends Model<forma_pagoAttributes, forma_pagoCreationAttributes> implements forma_pagoAttributes {
  id!: number;
  identificador!: string;
  nombre!: string;
  descuento!: number;
  editable?: number;
  borrado?: number;

  // forma_pago hasMany colegio via id_forma_pago
  colegios!: colegio[];
  getColegios!: Sequelize.HasManyGetAssociationsMixin<colegio>;
  setColegios!: Sequelize.HasManySetAssociationsMixin<colegio, colegioId>;
  addColegio!: Sequelize.HasManyAddAssociationMixin<colegio, colegioId>;
  addColegios!: Sequelize.HasManyAddAssociationsMixin<colegio, colegioId>;
  createColegio!: Sequelize.HasManyCreateAssociationMixin<colegio>;
  removeColegio!: Sequelize.HasManyRemoveAssociationMixin<colegio, colegioId>;
  removeColegios!: Sequelize.HasManyRemoveAssociationsMixin<colegio, colegioId>;
  hasColegio!: Sequelize.HasManyHasAssociationMixin<colegio, colegioId>;
  hasColegios!: Sequelize.HasManyHasAssociationsMixin<colegio, colegioId>;
  countColegios!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof forma_pago {
    return forma_pago.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    identificador: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descuento: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    editable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    borrado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'forma_pago',
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
    ]
  });
  }
}

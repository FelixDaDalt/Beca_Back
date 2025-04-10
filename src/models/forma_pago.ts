import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface forma_pagoAttributes {
  id: number;
  identificador: string;
  nombre: string;
  descuento: number;
  borrado?: number;
}

export type forma_pagoPk = "id";
export type forma_pagoId = forma_pago[forma_pagoPk];
export type forma_pagoOptionalAttributes = "id" | "borrado";
export type forma_pagoCreationAttributes = Optional<forma_pagoAttributes, forma_pagoOptionalAttributes>;

export class forma_pago extends Model<forma_pagoAttributes, forma_pagoCreationAttributes> implements forma_pagoAttributes {
  id!: number;
  identificador!: string;
  nombre!: string;
  descuento!: number;
  borrado?: number;


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

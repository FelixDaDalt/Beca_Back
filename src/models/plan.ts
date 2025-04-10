import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface planAttributes {
  id: number;
  identificador: string;
  nombre: string;
  bonificacion: number;
  borrado?: number;
}

export type planPk = "id";
export type planId = plan[planPk];
export type planOptionalAttributes = "id" | "borrado";
export type planCreationAttributes = Optional<planAttributes, planOptionalAttributes>;

export class plan extends Model<planAttributes, planCreationAttributes> implements planAttributes {
  id!: number;
  identificador!: string;
  nombre!: string;
  bonificacion!: number;
  borrado?: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof plan {
    return plan.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    identificador: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    bonificacion: {
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
    tableName: 'plan',
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

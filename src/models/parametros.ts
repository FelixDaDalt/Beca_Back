import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface parametrosAttributes {
  id: number;
  nombre: string;
  valor: string;
  clave: string;
  descripcion?: string;
}

export type parametrosPk = "id";
export type parametrosId = parametros[parametrosPk];
export type parametrosOptionalAttributes = "id" | "descripcion";
export type parametrosCreationAttributes = Optional<parametrosAttributes, parametrosOptionalAttributes>;

export class parametros extends Model<parametrosAttributes, parametrosCreationAttributes> implements parametrosAttributes {
  id!: number;
  nombre!: string;
  valor!: string;
  clave!: string;
  descripcion?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof parametros {
    return parametros.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    valor: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    clave: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'parametros',
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

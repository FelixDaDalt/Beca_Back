import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tycAttributes {
  id: number;
  contenido: string;
  fecha?: Date;
}

export type tycPk = "id";
export type tycId = tyc[tycPk];
export type tycOptionalAttributes = "id" | "fecha";
export type tycCreationAttributes = Optional<tycAttributes, tycOptionalAttributes>;

export class tyc extends Model<tycAttributes, tycCreationAttributes> implements tycAttributes {
  id!: number;
  contenido!: string;
  fecha?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof tyc {
    return tyc.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'tyc',
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

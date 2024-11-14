import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface menuAttributes {
  id: number;
  componente: string;
  nombre: string;
  desde_rol: number;
}

export type menuPk = "id";
export type menuId = menu[menuPk];
export type menuOptionalAttributes = "id";
export type menuCreationAttributes = Optional<menuAttributes, menuOptionalAttributes>;

export class menu extends Model<menuAttributes, menuCreationAttributes> implements menuAttributes {
  id!: number;
  componente!: string;
  nombre!: string;
  desde_rol!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof menu {
    return menu.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    componente: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    desde_rol: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'menu',
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

import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { red, redId } from './red';

export interface registro_redAttributes {
  id: number;
  id_red: number;
  id_usuario?: number;
  id_admi?: number;
  fecha_hora?: Date;
  descripcion: string;
  comentario?: string;
}

export type registro_redPk = "id";
export type registro_redId = registro_red[registro_redPk];
export type registro_redOptionalAttributes = "id" | "id_usuario" | "id_admi" | "fecha_hora" | "comentario";
export type registro_redCreationAttributes = Optional<registro_redAttributes, registro_redOptionalAttributes>;

export class registro_red extends Model<registro_redAttributes, registro_redCreationAttributes> implements registro_redAttributes {
  id!: number;
  id_red!: number;
  id_usuario?: number;
  id_admi?: number;
  fecha_hora?: Date;
  descripcion!: string;
  comentario?: string;

  // registro_red belongsTo red via id_red
  id_red_red!: red;
  getId_red_red!: Sequelize.BelongsToGetAssociationMixin<red>;
  setId_red_red!: Sequelize.BelongsToSetAssociationMixin<red, redId>;
  createId_red_red!: Sequelize.BelongsToCreateAssociationMixin<red>;

  static initModel(sequelize: Sequelize.Sequelize): typeof registro_red {
    return registro_red.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_red: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'red',
        key: 'id'
      }
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_admi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    comentario: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'registro_red',
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
        name: "registro_red_a_red",
        using: "BTREE",
        fields: [
          { name: "id_red" },
        ]
      },
    ]
  });
  }
}

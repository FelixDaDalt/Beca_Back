import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { usuario, usuarioId } from './usuario';

export interface reporte_errorAttributes {
  id: number;
  asunto: string;
  descripcion: string;
  id_usuario: number;
  borrado?: number;
  fecha: Date;
}

export type reporte_errorPk = "id";
export type reporte_errorId = reporte_error[reporte_errorPk];
export type reporte_errorOptionalAttributes = "id" | "borrado" | "fecha";
export type reporte_errorCreationAttributes = Optional<reporte_errorAttributes, reporte_errorOptionalAttributes>;

export class reporte_error extends Model<reporte_errorAttributes, reporte_errorCreationAttributes> implements reporte_errorAttributes {
  id!: number;
  asunto!: string;
  descripcion!: string;
  id_usuario!: number;
  borrado?: number;
  fecha!: Date;

  // reporte_error belongsTo usuario via id_usuario
  id_usuario_usuario!: usuario;
  getId_usuario_usuario!: Sequelize.BelongsToGetAssociationMixin<usuario>;
  setId_usuario_usuario!: Sequelize.BelongsToSetAssociationMixin<usuario, usuarioId>;
  createId_usuario_usuario!: Sequelize.BelongsToCreateAssociationMixin<usuario>;

  static initModel(sequelize: Sequelize.Sequelize): typeof reporte_error {
    return reporte_error.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    asunto: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    borrado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'reporte_error',
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
        name: "fk_reporte_error_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
  }
}

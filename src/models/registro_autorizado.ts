import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { usuario, usuarioId } from './usuario';

export interface registro_autorizadoAttributes {
  id: number;
  fecha_hora?: Date;
  registro: string;
  descripcion: string;
  id_usuario: number;
}

export type registro_autorizadoPk = "id";
export type registro_autorizadoId = registro_autorizado[registro_autorizadoPk];
export type registro_autorizadoOptionalAttributes = "id" | "fecha_hora" | "descripcion";
export type registro_autorizadoCreationAttributes = Optional<registro_autorizadoAttributes, registro_autorizadoOptionalAttributes>;

export class registro_autorizado extends Model<registro_autorizadoAttributes, registro_autorizadoCreationAttributes> implements registro_autorizadoAttributes {
  id!: number;
  fecha_hora?: Date;
  registro!: string;
  descripcion!: string;
  id_usuario!: number;

  // registro_autorizado belongsTo usuario via id_usuario
  id_usuario_usuario!: usuario;
  getId_usuario_usuario!: Sequelize.BelongsToGetAssociationMixin<usuario>;
  setId_usuario_usuario!: Sequelize.BelongsToSetAssociationMixin<usuario, usuarioId>;
  createId_usuario_usuario!: Sequelize.BelongsToCreateAssociationMixin<usuario>;

  static initModel(sequelize: Sequelize.Sequelize): typeof registro_autorizado {
    return registro_autorizado.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    registro: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "sin descipcion"
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'registro_autorizado',
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
        name: "registro_responsable_a_usuario_1",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
  }
}

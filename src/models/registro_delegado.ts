import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { usuario, usuarioId } from './usuario';

export interface registro_delegadoAttributes {
  id: number;
  fecha_hora?: Date;
  registro: string;
  descripcion: string;
  id_usuario: number;
}

export type registro_delegadoPk = "id";
export type registro_delegadoId = registro_delegado[registro_delegadoPk];
export type registro_delegadoOptionalAttributes = "id" | "fecha_hora" | "descripcion";
export type registro_delegadoCreationAttributes = Optional<registro_delegadoAttributes, registro_delegadoOptionalAttributes>;

export class registro_delegado extends Model<registro_delegadoAttributes, registro_delegadoCreationAttributes> implements registro_delegadoAttributes {
  id!: number;
  fecha_hora?: Date;
  registro!: string;
  descripcion!: string;
  id_usuario!: number;

  // registro_delegado belongsTo usuario via id_usuario
  id_usuario_usuario!: usuario;
  getId_usuario_usuario!: Sequelize.BelongsToGetAssociationMixin<usuario>;
  setId_usuario_usuario!: Sequelize.BelongsToSetAssociationMixin<usuario, usuarioId>;
  createId_usuario_usuario!: Sequelize.BelongsToCreateAssociationMixin<usuario>;

  static initModel(sequelize: Sequelize.Sequelize): typeof registro_delegado {
    return registro_delegado.init({
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
    tableName: 'registro_delegado',
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
        name: "registro_responsable_a_usuario_0",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
  }
}

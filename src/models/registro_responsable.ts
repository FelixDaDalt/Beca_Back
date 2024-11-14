import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { usuario, usuarioId } from './usuario';

export interface registro_responsableAttributes {
  id: number;
  fecha_hora?: Date;
  registro: string;
  descripcion: string;
  id_usuario: number;
}

export type registro_responsablePk = "id";
export type registro_responsableId = registro_responsable[registro_responsablePk];
export type registro_responsableOptionalAttributes = "id" | "fecha_hora" | "descripcion";
export type registro_responsableCreationAttributes = Optional<registro_responsableAttributes, registro_responsableOptionalAttributes>;

export class registro_responsable extends Model<registro_responsableAttributes, registro_responsableCreationAttributes> implements registro_responsableAttributes {
  id!: number;
  fecha_hora?: Date;
  registro!: string;
  descripcion!: string;
  id_usuario!: number;

  // registro_responsable belongsTo usuario via id_usuario
  id_usuario_usuario!: usuario;
  getId_usuario_usuario!: Sequelize.BelongsToGetAssociationMixin<usuario>;
  setId_usuario_usuario!: Sequelize.BelongsToSetAssociationMixin<usuario, usuarioId>;
  createId_usuario_usuario!: Sequelize.BelongsToCreateAssociationMixin<usuario>;

  static initModel(sequelize: Sequelize.Sequelize): typeof registro_responsable {
    return registro_responsable.init({
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
    tableName: 'registro_responsable',
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
        name: "registro_responsable_a_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
  }
}

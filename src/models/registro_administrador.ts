import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { administrador, administradorId } from './administrador';

export interface registro_administradorAttributes {
  id: number;
  id_usuario: number;
  fecha_hora?: Date;
  registro: string;
  descripcion?: string;
}

export type registro_administradorPk = "id";
export type registro_administradorId = registro_administrador[registro_administradorPk];
export type registro_administradorOptionalAttributes = "id" | "fecha_hora" | "descripcion";
export type registro_administradorCreationAttributes = Optional<registro_administradorAttributes, registro_administradorOptionalAttributes>;

export class registro_administrador extends Model<registro_administradorAttributes, registro_administradorCreationAttributes> implements registro_administradorAttributes {
  id!: number;
  id_usuario!: number;
  fecha_hora?: Date;
  registro!: string;
  descripcion?: string;

  // registro_administrador belongsTo administrador via id_usuario
  id_usuario_administrador!: administrador;
  getId_usuario_administrador!: Sequelize.BelongsToGetAssociationMixin<administrador>;
  setId_usuario_administrador!: Sequelize.BelongsToSetAssociationMixin<administrador, administradorId>;
  createId_usuario_administrador!: Sequelize.BelongsToCreateAssociationMixin<administrador>;

  static initModel(sequelize: Sequelize.Sequelize): typeof registro_administrador {
    return registro_administrador.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'administrador',
        key: 'id'
      }
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
      allowNull: true,
      defaultValue: "sin descripcion"
    }
  }, {
    sequelize,
    tableName: 'registro_administrador',
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
        name: "registro_a_administrador",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
  }
}

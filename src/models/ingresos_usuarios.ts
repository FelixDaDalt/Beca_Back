import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { usuario, usuarioId } from './usuario';

export interface ingresos_usuariosAttributes {
  id: number;
  id_usuario?: number;
  fecha_hora: Date;
  ip?: string;
  navegador?: string;
  estado?: 'exitoso' | 'fallido';
  dni_ingresado: string;
}

export type ingresos_usuariosPk = "id";
export type ingresos_usuariosId = ingresos_usuarios[ingresos_usuariosPk];
export type ingresos_usuariosOptionalAttributes = "id" | "id_usuario" | "fecha_hora" | "ip" | "navegador" | "estado";
export type ingresos_usuariosCreationAttributes = Optional<ingresos_usuariosAttributes, ingresos_usuariosOptionalAttributes>;

export class ingresos_usuarios extends Model<ingresos_usuariosAttributes, ingresos_usuariosCreationAttributes> implements ingresos_usuariosAttributes {
  id!: number;
  id_usuario?: number;
  fecha_hora!: Date;
  ip?: string;
  navegador?: string;
  estado?: 'exitoso' | 'fallido';
  dni_ingresado!: string;

  // ingresos_usuarios belongsTo usuario via id_usuario
  id_usuario_usuario!: usuario;
  getId_usuario_usuario!: Sequelize.BelongsToGetAssociationMixin<usuario>;
  setId_usuario_usuario!: Sequelize.BelongsToSetAssociationMixin<usuario, usuarioId>;
  createId_usuario_usuario!: Sequelize.BelongsToCreateAssociationMixin<usuario>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ingresos_usuarios {
    return ingresos_usuarios.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    navegador: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('exitoso','fallido'),
      allowNull: true
    },
    dni_ingresado: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ingresos_usuarios',
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
        name: "ingresos_usuarios_a_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
  }
}

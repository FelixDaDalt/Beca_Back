import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { administrador, administradorId } from './administrador';

export interface ingresos_administradoresAttributes {
  id: number;
  id_usuario?: number;
  fecha_hora: Date;
  ip?: string;
  navegador?: string;
  estado?: 'exitoso' | 'fallido';
  dni_ingresado: string;
}

export type ingresos_administradoresPk = "id";
export type ingresos_administradoresId = ingresos_administradores[ingresos_administradoresPk];
export type ingresos_administradoresOptionalAttributes = "id" | "id_usuario" | "fecha_hora" | "ip" | "navegador" | "estado";
export type ingresos_administradoresCreationAttributes = Optional<ingresos_administradoresAttributes, ingresos_administradoresOptionalAttributes>;

export class ingresos_administradores extends Model<ingresos_administradoresAttributes, ingresos_administradoresCreationAttributes> implements ingresos_administradoresAttributes {
  id!: number;
  id_usuario?: number;
  fecha_hora!: Date;
  ip?: string;
  navegador?: string;
  estado?: 'exitoso' | 'fallido';
  dni_ingresado!: string;

  // ingresos_administradores belongsTo administrador via id_usuario
  id_usuario_administrador!: administrador;
  getId_usuario_administrador!: Sequelize.BelongsToGetAssociationMixin<administrador>;
  setId_usuario_administrador!: Sequelize.BelongsToSetAssociationMixin<administrador, administradorId>;
  createId_usuario_administrador!: Sequelize.BelongsToCreateAssociationMixin<administrador>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ingresos_administradores {
    return ingresos_administradores.init({
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
        model: 'administrador',
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
    tableName: 'ingresos_administradores',
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
        name: "ingresos_administradores_a_administrador",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
  }
}

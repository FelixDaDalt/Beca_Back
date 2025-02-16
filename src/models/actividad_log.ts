import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { administrador, administradorId } from './administrador';
import type { usuario, usuarioId } from './usuario';

export interface actividad_logAttributes {
  id: number;
  usuario_id?: number;
  admin_id?: number;
  accion?: string;
  descripcion?: string;
  ip?: string;
  navegador?: string;
  query_params?: string;
  fecha: Date;
  id_rol?: number;
  id_colegio?: number;
}

export type actividad_logPk = "id";
export type actividad_logId = actividad_log[actividad_logPk];
export type actividad_logOptionalAttributes = "id" | "usuario_id" | "admin_id" | "accion" | "descripcion" | "ip" | "navegador" | "query_params" | "fecha" | "id_rol" | "id_colegio";
export type actividad_logCreationAttributes = Optional<actividad_logAttributes, actividad_logOptionalAttributes>;

export class actividad_log extends Model<actividad_logAttributes, actividad_logCreationAttributes> implements actividad_logAttributes {
  id!: number;
  usuario_id?: number;
  admin_id?: number;
  accion?: string;
  descripcion?: string;
  ip?: string;
  navegador?: string;
  query_params?: string;
  fecha!: Date;
  id_rol?: number;
  id_colegio?: number;

  // actividad_log belongsTo administrador via admin_id
  admin!: administrador;
  getAdmin!: Sequelize.BelongsToGetAssociationMixin<administrador>;
  setAdmin!: Sequelize.BelongsToSetAssociationMixin<administrador, administradorId>;
  createAdmin!: Sequelize.BelongsToCreateAssociationMixin<administrador>;
  // actividad_log belongsTo usuario via usuario_id
  usuario!: usuario;
  getUsuario!: Sequelize.BelongsToGetAssociationMixin<usuario>;
  setUsuario!: Sequelize.BelongsToSetAssociationMixin<usuario, usuarioId>;
  createUsuario!: Sequelize.BelongsToCreateAssociationMixin<usuario>;

  static initModel(sequelize: Sequelize.Sequelize): typeof actividad_log {
    return actividad_log.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'administrador',
        key: 'id'
      }
    },
    accion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    navegador: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    query_params: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_colegio: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'actividad_log',
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
        name: "fk_actividad_log_administrador",
        using: "BTREE",
        fields: [
          { name: "admin_id" },
        ]
      },
      {
        name: "fk_actividad_log_usuario",
        using: "BTREE",
        fields: [
          { name: "usuario_id" },
        ]
      },
    ]
  });
  }
}

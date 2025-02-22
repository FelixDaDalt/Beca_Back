import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { beca_solicitud, beca_solicitudId } from './beca_solicitud';

export interface beca_automatizacion_logAttributes {
  id: number;
  id_beca_solicitud: number;
  id_estado_anterior: number;
  id_estado_nuevo: number;
  fecha_registro: Date;
  tipo_notificacion: 'VENCIDA' | 'POR_VENCER' | 'BAJA';
  email_colegio_solicitante?: string;
  email_colegio_ofrecio?: string;
  motivo?: string;
}

export type beca_automatizacion_logPk = "id";
export type beca_automatizacion_logId = beca_automatizacion_log[beca_automatizacion_logPk];
export type beca_automatizacion_logOptionalAttributes = "id" | "fecha_registro" | "email_colegio_solicitante" | "email_colegio_ofrecio" | "motivo";
export type beca_automatizacion_logCreationAttributes = Optional<beca_automatizacion_logAttributes, beca_automatizacion_logOptionalAttributes>;

export class beca_automatizacion_log extends Model<beca_automatizacion_logAttributes, beca_automatizacion_logCreationAttributes> implements beca_automatizacion_logAttributes {
  id!: number;
  id_beca_solicitud!: number;
  id_estado_anterior!: number;
  id_estado_nuevo!: number;
  fecha_registro!: Date;
  tipo_notificacion!: 'VENCIDA' | 'POR_VENCER' | 'BAJA';
  email_colegio_solicitante?: string;
  email_colegio_ofrecio?: string;
  motivo?: string;

  // beca_automatizacion_log belongsTo beca_solicitud via id_beca_solicitud
  id_beca_solicitud_beca_solicitud!: beca_solicitud;
  getId_beca_solicitud_beca_solicitud!: Sequelize.BelongsToGetAssociationMixin<beca_solicitud>;
  setId_beca_solicitud_beca_solicitud!: Sequelize.BelongsToSetAssociationMixin<beca_solicitud, beca_solicitudId>;
  createId_beca_solicitud_beca_solicitud!: Sequelize.BelongsToCreateAssociationMixin<beca_solicitud>;

  static initModel(sequelize: Sequelize.Sequelize): typeof beca_automatizacion_log {
    return beca_automatizacion_log.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_beca_solicitud: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'beca_solicitud',
        key: 'id'
      }
    },
    id_estado_anterior: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_estado_nuevo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    tipo_notificacion: {
      type: DataTypes.ENUM('VENCIDA','POR_VENCER','BAJA'),
      allowNull: false
    },
    email_colegio_solicitante: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email_colegio_ofrecio: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'beca_automatizacion_log',
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
        name: "id_beca_solicitud",
        using: "BTREE",
        fields: [
          { name: "id_beca_solicitud" },
        ]
      },
    ]
  });
  }
}

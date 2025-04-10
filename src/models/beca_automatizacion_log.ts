import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { beca_automatizacion_ejecucion, beca_automatizacion_ejecucionId } from './beca_automatizacion_ejecucion';
import type { beca_solicitud, beca_solicitudId } from './beca_solicitud';

export interface beca_automatizacion_logAttributes {
  id: number;
  id_beca_solicitud?: number;
  id_estado_anterior?: number;
  id_estado_nuevo?: number;
  fecha_registro: Date;
  tipo_notificacion: 'VENCIDA' | 'POR_VENCER' | 'BAJA' | 'EJECUCION';
  email_colegio_solicitante?: string;
  email_colegio_ofrecio?: string;
  motivo?: string;
  id_ejecucion?: number;
}

export type beca_automatizacion_logPk = "id";
export type beca_automatizacion_logId = beca_automatizacion_log[beca_automatizacion_logPk];
export type beca_automatizacion_logOptionalAttributes = "id" | "id_beca_solicitud" | "id_estado_anterior" | "id_estado_nuevo" | "fecha_registro" | "email_colegio_solicitante" | "email_colegio_ofrecio" | "motivo" | "id_ejecucion";
export type beca_automatizacion_logCreationAttributes = Optional<beca_automatizacion_logAttributes, beca_automatizacion_logOptionalAttributes>;

export class beca_automatizacion_log extends Model<beca_automatizacion_logAttributes, beca_automatizacion_logCreationAttributes> implements beca_automatizacion_logAttributes {
  id!: number;
  id_beca_solicitud?: number;
  id_estado_anterior?: number;
  id_estado_nuevo?: number;
  fecha_registro!: Date;
  tipo_notificacion!: 'VENCIDA' | 'POR_VENCER' | 'BAJA' | 'EJECUCION';
  email_colegio_solicitante?: string;
  email_colegio_ofrecio?: string;
  motivo?: string;
  id_ejecucion?: number;

  // beca_automatizacion_log belongsTo beca_automatizacion_ejecucion via id_ejecucion
  id_ejecucion_beca_automatizacion_ejecucion!: beca_automatizacion_ejecucion;
  getId_ejecucion_beca_automatizacion_ejecucion!: Sequelize.BelongsToGetAssociationMixin<beca_automatizacion_ejecucion>;
  setId_ejecucion_beca_automatizacion_ejecucion!: Sequelize.BelongsToSetAssociationMixin<beca_automatizacion_ejecucion, beca_automatizacion_ejecucionId>;
  createId_ejecucion_beca_automatizacion_ejecucion!: Sequelize.BelongsToCreateAssociationMixin<beca_automatizacion_ejecucion>;
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
      allowNull: true,
      references: {
        model: 'beca_solicitud',
        key: 'id'
      }
    },
    id_estado_anterior: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_estado_nuevo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    tipo_notificacion: {
      type: DataTypes.ENUM('VENCIDA','POR_VENCER','BAJA','EJECUCION'),
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
    },
    id_ejecucion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'beca_automatizacion_ejecucion',
        key: 'id'
      }
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
      {
        name: "fk_beca_automatizacion_log_beca_automatizacion_ejecucion",
        using: "BTREE",
        fields: [
          { name: "id_ejecucion" },
        ]
      },
    ]
  });
  }
}

import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { autorizados, autorizadosId } from './autorizados';
import type { beca, becaId } from './beca';
import type { beca_automatizacion_log, beca_automatizacion_logId } from './beca_automatizacion_log';
import type { beca_estado, beca_estadoId } from './beca_estado';
import type { beca_resolucion, beca_resolucionId } from './beca_resolucion';
import type { colegio, colegioId } from './colegio';
import type { notificaciones, notificacionesId } from './notificaciones';
import type { usuario, usuarioId } from './usuario';

export interface beca_solicitudAttributes {
  id: number;
  id_beca: number;
  id_colegio_solic: number;
  id_usuario_solic: number;
  fecha_hora?: Date;
  alumno_nombre: string;
  alumno_apellido: string;
  alumno_fecha: string;
  alumno_dni: string;
  detalle?: string;
  id_resolucion: number;
  res_comentario?: string;
  id_usuario_reso?: number;
  reso_fecha_hora?: Date;
  id_estado: number;
  id_usuario_baja?: number;
  baja_fecha_hora?: Date;
  baja_comentario?: string;
  sinLeer?: number;
  sinLeerSolicitante?: number;
  id_pariente: number;
  notificarPorVencer?: number;
  notificarVencida?: number;
}

export type beca_solicitudPk = "id";
export type beca_solicitudId = beca_solicitud[beca_solicitudPk];
export type beca_solicitudOptionalAttributes = "id" | "fecha_hora" | "detalle" | "id_resolucion" | "res_comentario" | "id_usuario_reso" | "reso_fecha_hora" | "id_estado" | "id_usuario_baja" | "baja_fecha_hora" | "baja_comentario" | "sinLeer" | "sinLeerSolicitante" | "notificarPorVencer" | "notificarVencida";
export type beca_solicitudCreationAttributes = Optional<beca_solicitudAttributes, beca_solicitudOptionalAttributes>;

export class beca_solicitud extends Model<beca_solicitudAttributes, beca_solicitudCreationAttributes> implements beca_solicitudAttributes {
  id!: number;
  id_beca!: number;
  id_colegio_solic!: number;
  id_usuario_solic!: number;
  fecha_hora?: Date;
  alumno_nombre!: string;
  alumno_apellido!: string;
  alumno_fecha!: string;
  alumno_dni!: string;
  detalle?: string;
  id_resolucion!: number;
  res_comentario?: string;
  id_usuario_reso?: number;
  reso_fecha_hora?: Date;
  id_estado!: number;
  id_usuario_baja?: number;
  baja_fecha_hora?: Date;
  baja_comentario?: string;
  sinLeer?: number;
  sinLeerSolicitante?: number;
  id_pariente!: number;
  notificarPorVencer?: number;
  notificarVencida?: number;

  // beca_solicitud belongsTo autorizados via id_pariente
  id_pariente_autorizado!: autorizados;
  getId_pariente_autorizado!: Sequelize.BelongsToGetAssociationMixin<autorizados>;
  setId_pariente_autorizado!: Sequelize.BelongsToSetAssociationMixin<autorizados, autorizadosId>;
  createId_pariente_autorizado!: Sequelize.BelongsToCreateAssociationMixin<autorizados>;
  // beca_solicitud belongsTo beca via id_beca
  id_beca_beca!: beca;
  getId_beca_beca!: Sequelize.BelongsToGetAssociationMixin<beca>;
  setId_beca_beca!: Sequelize.BelongsToSetAssociationMixin<beca, becaId>;
  createId_beca_beca!: Sequelize.BelongsToCreateAssociationMixin<beca>;
  // beca_solicitud belongsTo beca_estado via id_estado
  id_estado_beca_estado!: beca_estado;
  getId_estado_beca_estado!: Sequelize.BelongsToGetAssociationMixin<beca_estado>;
  setId_estado_beca_estado!: Sequelize.BelongsToSetAssociationMixin<beca_estado, beca_estadoId>;
  createId_estado_beca_estado!: Sequelize.BelongsToCreateAssociationMixin<beca_estado>;
  // beca_solicitud belongsTo beca_resolucion via id_resolucion
  id_resolucion_beca_resolucion!: beca_resolucion;
  getId_resolucion_beca_resolucion!: Sequelize.BelongsToGetAssociationMixin<beca_resolucion>;
  setId_resolucion_beca_resolucion!: Sequelize.BelongsToSetAssociationMixin<beca_resolucion, beca_resolucionId>;
  createId_resolucion_beca_resolucion!: Sequelize.BelongsToCreateAssociationMixin<beca_resolucion>;
  // beca_solicitud hasMany beca_automatizacion_log via id_beca_solicitud
  beca_automatizacion_logs!: beca_automatizacion_log[];
  getBeca_automatizacion_logs!: Sequelize.HasManyGetAssociationsMixin<beca_automatizacion_log>;
  setBeca_automatizacion_logs!: Sequelize.HasManySetAssociationsMixin<beca_automatizacion_log, beca_automatizacion_logId>;
  addBeca_automatizacion_log!: Sequelize.HasManyAddAssociationMixin<beca_automatizacion_log, beca_automatizacion_logId>;
  addBeca_automatizacion_logs!: Sequelize.HasManyAddAssociationsMixin<beca_automatizacion_log, beca_automatizacion_logId>;
  createBeca_automatizacion_log!: Sequelize.HasManyCreateAssociationMixin<beca_automatizacion_log>;
  removeBeca_automatizacion_log!: Sequelize.HasManyRemoveAssociationMixin<beca_automatizacion_log, beca_automatizacion_logId>;
  removeBeca_automatizacion_logs!: Sequelize.HasManyRemoveAssociationsMixin<beca_automatizacion_log, beca_automatizacion_logId>;
  hasBeca_automatizacion_log!: Sequelize.HasManyHasAssociationMixin<beca_automatizacion_log, beca_automatizacion_logId>;
  hasBeca_automatizacion_logs!: Sequelize.HasManyHasAssociationsMixin<beca_automatizacion_log, beca_automatizacion_logId>;
  countBeca_automatizacion_logs!: Sequelize.HasManyCountAssociationsMixin;
  // beca_solicitud hasMany notificaciones via id_solicitud
  notificaciones!: notificaciones[];
  getNotificaciones!: Sequelize.HasManyGetAssociationsMixin<notificaciones>;
  setNotificaciones!: Sequelize.HasManySetAssociationsMixin<notificaciones, notificacionesId>;
  addNotificacione!: Sequelize.HasManyAddAssociationMixin<notificaciones, notificacionesId>;
  addNotificaciones!: Sequelize.HasManyAddAssociationsMixin<notificaciones, notificacionesId>;
  createNotificacione!: Sequelize.HasManyCreateAssociationMixin<notificaciones>;
  removeNotificacione!: Sequelize.HasManyRemoveAssociationMixin<notificaciones, notificacionesId>;
  removeNotificaciones!: Sequelize.HasManyRemoveAssociationsMixin<notificaciones, notificacionesId>;
  hasNotificacione!: Sequelize.HasManyHasAssociationMixin<notificaciones, notificacionesId>;
  hasNotificaciones!: Sequelize.HasManyHasAssociationsMixin<notificaciones, notificacionesId>;
  countNotificaciones!: Sequelize.HasManyCountAssociationsMixin;
  // beca_solicitud belongsTo colegio via id_colegio_solic
  id_colegio_solic_colegio!: colegio;
  getId_colegio_solic_colegio!: Sequelize.BelongsToGetAssociationMixin<colegio>;
  setId_colegio_solic_colegio!: Sequelize.BelongsToSetAssociationMixin<colegio, colegioId>;
  createId_colegio_solic_colegio!: Sequelize.BelongsToCreateAssociationMixin<colegio>;
  // beca_solicitud belongsTo usuario via id_usuario_solic
  id_usuario_solic_usuario!: usuario;
  getId_usuario_solic_usuario!: Sequelize.BelongsToGetAssociationMixin<usuario>;
  setId_usuario_solic_usuario!: Sequelize.BelongsToSetAssociationMixin<usuario, usuarioId>;
  createId_usuario_solic_usuario!: Sequelize.BelongsToCreateAssociationMixin<usuario>;
  // beca_solicitud belongsTo usuario via id_usuario_reso
  id_usuario_reso_usuario!: usuario;
  getId_usuario_reso_usuario!: Sequelize.BelongsToGetAssociationMixin<usuario>;
  setId_usuario_reso_usuario!: Sequelize.BelongsToSetAssociationMixin<usuario, usuarioId>;
  createId_usuario_reso_usuario!: Sequelize.BelongsToCreateAssociationMixin<usuario>;
  // beca_solicitud belongsTo usuario via id_usuario_baja
  id_usuario_baja_usuario!: usuario;
  getId_usuario_baja_usuario!: Sequelize.BelongsToGetAssociationMixin<usuario>;
  setId_usuario_baja_usuario!: Sequelize.BelongsToSetAssociationMixin<usuario, usuarioId>;
  createId_usuario_baja_usuario!: Sequelize.BelongsToCreateAssociationMixin<usuario>;

  static initModel(sequelize: Sequelize.Sequelize): typeof beca_solicitud {
    return beca_solicitud.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_beca: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'beca',
        key: 'id'
      }
    },
    id_colegio_solic: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colegio',
        key: 'id'
      }
    },
    id_usuario_solic: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    alumno_nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    alumno_apellido: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    alumno_fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    alumno_dni: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    detalle: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_resolucion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'beca_resolucion',
        key: 'id'
      }
    },
    res_comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_usuario_reso: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    reso_fecha_hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'beca_estado',
        key: 'id'
      }
    },
    id_usuario_baja: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    baja_fecha_hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    baja_comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sinLeer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    sinLeerSolicitante: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    id_pariente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'autorizados',
        key: 'id'
      }
    },
    notificarPorVencer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    notificarVencida: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'beca_solicitud',
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
        name: "solicitud_beca_a_becas_publicadas",
        using: "BTREE",
        fields: [
          { name: "id_beca" },
        ]
      },
      {
        name: "solicitud_beca_a_colegio",
        using: "BTREE",
        fields: [
          { name: "id_colegio_solic" },
        ]
      },
      {
        name: "solicitud_beca_a_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario_solic" },
        ]
      },
      {
        name: "fk_beca_solicitud_beca_resolucion",
        using: "BTREE",
        fields: [
          { name: "id_resolucion" },
        ]
      },
      {
        name: "beca_solicitud_res_a_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario_reso" },
        ]
      },
      {
        name: "fk_beca_solicitud_beca_estado",
        using: "BTREE",
        fields: [
          { name: "id_estado" },
        ]
      },
      {
        name: "fk_beca_solicitud_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario_baja" },
        ]
      },
      {
        name: "fk_beca_solicitud_usuario_0",
        using: "BTREE",
        fields: [
          { name: "id_pariente" },
        ]
      },
    ]
  });
  }
}

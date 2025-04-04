import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { beca_solicitud, beca_solicitudId } from './beca_solicitud';
import type { colegio, colegioId } from './colegio';

export interface notificacionesAttributes {
  id: number;
  id_solicitud: number;
  id_colegio_ofer: number;
  id_colegio_solic: number;
  resuelta?: number;
  desestimada?: number;
  porvencer?: number;
  vencida?: number;
  porbaja?: number;
  dadabaja?: number;
  leido?: number;
  fecha?: Date;
  leido_solic?: number;
  leido_ofer?: number;
}

export type notificacionesPk = "id";
export type notificacionesId = notificaciones[notificacionesPk];
export type notificacionesOptionalAttributes = "id" | "resuelta" | "desestimada" | "porvencer" | "vencida" | "porbaja" | "dadabaja" | "leido" | "fecha" | "leido_solic" | "leido_ofer";
export type notificacionesCreationAttributes = Optional<notificacionesAttributes, notificacionesOptionalAttributes>;

export class notificaciones extends Model<notificacionesAttributes, notificacionesCreationAttributes> implements notificacionesAttributes {
  id!: number;
  id_solicitud!: number;
  id_colegio_ofer!: number;
  id_colegio_solic!: number;
  resuelta?: number;
  desestimada?: number;
  porvencer?: number;
  vencida?: number;
  porbaja?: number;
  dadabaja?: number;
  leido?: number;
  fecha?: Date;
  leido_solic?: number;
  leido_ofer?: number;

  // notificaciones belongsTo beca_solicitud via id_solicitud
  id_solicitud_beca_solicitud!: beca_solicitud;
  getId_solicitud_beca_solicitud!: Sequelize.BelongsToGetAssociationMixin<beca_solicitud>;
  setId_solicitud_beca_solicitud!: Sequelize.BelongsToSetAssociationMixin<beca_solicitud, beca_solicitudId>;
  createId_solicitud_beca_solicitud!: Sequelize.BelongsToCreateAssociationMixin<beca_solicitud>;
  // notificaciones belongsTo colegio via id_colegio_ofer
  id_colegio_ofer_colegio!: colegio;
  getId_colegio_ofer_colegio!: Sequelize.BelongsToGetAssociationMixin<colegio>;
  setId_colegio_ofer_colegio!: Sequelize.BelongsToSetAssociationMixin<colegio, colegioId>;
  createId_colegio_ofer_colegio!: Sequelize.BelongsToCreateAssociationMixin<colegio>;
  // notificaciones belongsTo colegio via id_colegio_solic
  id_colegio_solic_colegio!: colegio;
  getId_colegio_solic_colegio!: Sequelize.BelongsToGetAssociationMixin<colegio>;
  setId_colegio_solic_colegio!: Sequelize.BelongsToSetAssociationMixin<colegio, colegioId>;
  createId_colegio_solic_colegio!: Sequelize.BelongsToCreateAssociationMixin<colegio>;

  static initModel(sequelize: Sequelize.Sequelize): typeof notificaciones {
    return notificaciones.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_solicitud: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'beca_solicitud',
        key: 'id'
      }
    },
    id_colegio_ofer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colegio',
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
    resuelta: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    desestimada: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    porvencer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    vencida: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    porbaja: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    dadabaja: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    leido: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    leido_solic: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    leido_ofer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'notificaciones',
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
        name: "fk_notificaciones_beca_solicitud",
        using: "BTREE",
        fields: [
          { name: "id_solicitud" },
        ]
      },
      {
        name: "fk_notificaciones_colegio",
        using: "BTREE",
        fields: [
          { name: "id_colegio_ofer" },
        ]
      },
      {
        name: "fk_notificaciones_colegio_0",
        using: "BTREE",
        fields: [
          { name: "id_colegio_solic" },
        ]
      },
    ]
  });
  }
}

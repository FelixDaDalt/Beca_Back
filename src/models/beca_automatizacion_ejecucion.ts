import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { beca_automatizacion_log, beca_automatizacion_logId } from './beca_automatizacion_log';

export interface beca_automatizacion_ejecucionAttributes {
  id: number;
  tipo: string;
  fecha?: Date;
  estado: string;
  total_procesadas: number;
  error?: string;
}

export type beca_automatizacion_ejecucionPk = "id";
export type beca_automatizacion_ejecucionId = beca_automatizacion_ejecucion[beca_automatizacion_ejecucionPk];
export type beca_automatizacion_ejecucionOptionalAttributes = "id" | "fecha" | "error";
export type beca_automatizacion_ejecucionCreationAttributes = Optional<beca_automatizacion_ejecucionAttributes, beca_automatizacion_ejecucionOptionalAttributes>;

export class beca_automatizacion_ejecucion extends Model<beca_automatizacion_ejecucionAttributes, beca_automatizacion_ejecucionCreationAttributes> implements beca_automatizacion_ejecucionAttributes {
  id!: number;
  tipo!: string;
  fecha?: Date;
  estado!: string;
  total_procesadas!: number;
  error?: string;

  // beca_automatizacion_ejecucion hasMany beca_automatizacion_log via id_ejecucion
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

  static initModel(sequelize: Sequelize.Sequelize): typeof beca_automatizacion_ejecucion {
    return beca_automatizacion_ejecucion.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    total_procesadas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'beca_automatizacion_ejecucion',
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
    ]
  });
  }
}

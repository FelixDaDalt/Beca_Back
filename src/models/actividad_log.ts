import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

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
}

export type actividad_logPk = "id";
export type actividad_logId = actividad_log[actividad_logPk];
export type actividad_logOptionalAttributes = "id" | "usuario_id" | "admin_id" | "accion" | "descripcion" | "ip" | "navegador" | "query_params" | "fecha";
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
      allowNull: true
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    ]
  });
  }
}

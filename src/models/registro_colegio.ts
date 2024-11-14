import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { colegio, colegioId } from './colegio';

export interface registro_colegioAttributes {
  id: number;
  id_colegio: number;
  id_usuario?: number;
  id_admi?: number;
  fecha_hora: Date;
  descripcion: string;
  comentario?: string;
}

export type registro_colegioPk = "id";
export type registro_colegioId = registro_colegio[registro_colegioPk];
export type registro_colegioOptionalAttributes = "id" | "id_usuario" | "id_admi" | "fecha_hora" | "comentario";
export type registro_colegioCreationAttributes = Optional<registro_colegioAttributes, registro_colegioOptionalAttributes>;

export class registro_colegio extends Model<registro_colegioAttributes, registro_colegioCreationAttributes> implements registro_colegioAttributes {
  id!: number;
  id_colegio!: number;
  id_usuario?: number;
  id_admi?: number;
  fecha_hora!: Date;
  descripcion!: string;
  comentario?: string;

  // registro_colegio belongsTo colegio via id_colegio
  id_colegio_colegio!: colegio;
  getId_colegio_colegio!: Sequelize.BelongsToGetAssociationMixin<colegio>;
  setId_colegio_colegio!: Sequelize.BelongsToSetAssociationMixin<colegio, colegioId>;
  createId_colegio_colegio!: Sequelize.BelongsToCreateAssociationMixin<colegio>;

  static initModel(sequelize: Sequelize.Sequelize): typeof registro_colegio {
    return registro_colegio.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_colegio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colegio',
        key: 'id'
      }
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_admi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    comentario: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'registro_colegio',
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
        name: "fk_registro_colegio_colegio",
        using: "BTREE",
        fields: [
          { name: "id_colegio" },
        ]
      },
    ]
  });
  }
}

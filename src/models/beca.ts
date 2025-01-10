import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { beca_solicitud, beca_solicitudId } from './beca_solicitud';
import type { colegio, colegioId } from './colegio';
import type { red, redId } from './red';
import type { usuario, usuarioId } from './usuario';

export interface becaAttributes {
  id: number;
  id_red: number;
  id_colegio: number;
  fecha_hora: Date;
  id_usuario: number;
  borrado?: number;
  cantidad: number;
}

export type becaPk = "id";
export type becaId = beca[becaPk];
export type becaOptionalAttributes = "id" | "fecha_hora" | "borrado";
export type becaCreationAttributes = Optional<becaAttributes, becaOptionalAttributes>;

export class beca extends Model<becaAttributes, becaCreationAttributes> implements becaAttributes {
  id!: number;
  id_red!: number;
  id_colegio!: number;
  fecha_hora!: Date;
  id_usuario!: number;
  borrado?: number;
  cantidad!: number;

  // beca hasMany beca_solicitud via id_beca
  beca_solicituds!: beca_solicitud[];
  getBeca_solicituds!: Sequelize.HasManyGetAssociationsMixin<beca_solicitud>;
  setBeca_solicituds!: Sequelize.HasManySetAssociationsMixin<beca_solicitud, beca_solicitudId>;
  addBeca_solicitud!: Sequelize.HasManyAddAssociationMixin<beca_solicitud, beca_solicitudId>;
  addBeca_solicituds!: Sequelize.HasManyAddAssociationsMixin<beca_solicitud, beca_solicitudId>;
  createBeca_solicitud!: Sequelize.HasManyCreateAssociationMixin<beca_solicitud>;
  removeBeca_solicitud!: Sequelize.HasManyRemoveAssociationMixin<beca_solicitud, beca_solicitudId>;
  removeBeca_solicituds!: Sequelize.HasManyRemoveAssociationsMixin<beca_solicitud, beca_solicitudId>;
  hasBeca_solicitud!: Sequelize.HasManyHasAssociationMixin<beca_solicitud, beca_solicitudId>;
  hasBeca_solicituds!: Sequelize.HasManyHasAssociationsMixin<beca_solicitud, beca_solicitudId>;
  countBeca_solicituds!: Sequelize.HasManyCountAssociationsMixin;
  // beca belongsTo colegio via id_colegio
  id_colegio_colegio!: colegio;
  getId_colegio_colegio!: Sequelize.BelongsToGetAssociationMixin<colegio>;
  setId_colegio_colegio!: Sequelize.BelongsToSetAssociationMixin<colegio, colegioId>;
  createId_colegio_colegio!: Sequelize.BelongsToCreateAssociationMixin<colegio>;
  // beca belongsTo red via id_red
  id_red_red!: red;
  getId_red_red!: Sequelize.BelongsToGetAssociationMixin<red>;
  setId_red_red!: Sequelize.BelongsToSetAssociationMixin<red, redId>;
  createId_red_red!: Sequelize.BelongsToCreateAssociationMixin<red>;
  // beca belongsTo usuario via id_usuario
  id_usuario_usuario!: usuario;
  getId_usuario_usuario!: Sequelize.BelongsToGetAssociationMixin<usuario>;
  setId_usuario_usuario!: Sequelize.BelongsToSetAssociationMixin<usuario, usuarioId>;
  createId_usuario_usuario!: Sequelize.BelongsToCreateAssociationMixin<usuario>;

  static initModel(sequelize: Sequelize.Sequelize): typeof beca {
    return beca.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_red: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'red',
        key: 'id'
      }
    },
    id_colegio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colegio',
        key: 'id'
      }
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    borrado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'beca',
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
        name: "becas_publicadas_a_red",
        using: "BTREE",
        fields: [
          { name: "id_red" },
        ]
      },
      {
        name: "beca_a_colegio",
        using: "BTREE",
        fields: [
          { name: "id_colegio" },
        ]
      },
      {
        name: "beca_a_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
  }
}

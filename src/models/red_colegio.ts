import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { colegio, colegioId } from './colegio';
import type { red, redId } from './red';

export interface red_colegioAttributes {
  id_colegio: number;
  anfitrion?: number;
  id_red: number;
  bp: number;
  btp: number;
  db: number;
  dbu: number;
  dbd: number;
  bsp: number;
  bsa: number;
  bde: number;
  borrado?: number;
}

export type red_colegioPk = "id_colegio" | "id_red";
export type red_colegioId = red_colegio[red_colegioPk];
export type red_colegioOptionalAttributes = "anfitrion" | "bp" | "btp" | "db" | "dbu" | "dbd" | "bsp" | "bsa" | "bde" | "borrado";
export type red_colegioCreationAttributes = Optional<red_colegioAttributes, red_colegioOptionalAttributes>;

export class red_colegio extends Model<red_colegioAttributes, red_colegioCreationAttributes> implements red_colegioAttributes {
  id_colegio!: number;
  anfitrion?: number;
  id_red!: number;
  bp!: number;
  btp!: number;
  db!: number;
  dbu!: number;
  dbd!: number;
  bsp!: number;
  bsa!: number;
  bde!: number;
  borrado?: number;

  // red_colegio belongsTo colegio via id_colegio
  id_colegio_colegio!: colegio;
  getId_colegio_colegio!: Sequelize.BelongsToGetAssociationMixin<colegio>;
  setId_colegio_colegio!: Sequelize.BelongsToSetAssociationMixin<colegio, colegioId>;
  createId_colegio_colegio!: Sequelize.BelongsToCreateAssociationMixin<colegio>;
  // red_colegio belongsTo red via id_red
  id_red_red!: red;
  getId_red_red!: Sequelize.BelongsToGetAssociationMixin<red>;
  setId_red_red!: Sequelize.BelongsToSetAssociationMixin<red, redId>;
  createId_red_red!: Sequelize.BelongsToCreateAssociationMixin<red>;

  static initModel(sequelize: Sequelize.Sequelize): typeof red_colegio {
    return red_colegio.init({
    id_colegio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'colegio',
        key: 'id'
      }
    },
    anfitrion: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    id_red: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'red',
        key: 'id'
      }
    },
    bp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    btp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    db: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    dbu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    dbd: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bsp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bsa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bde: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    borrado: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'red_colegio',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_colegio" },
          { name: "id_red" },
        ]
      },
      {
        name: "id_red",
        using: "BTREE",
        fields: [
          { name: "id_red" },
        ]
      },
    ]
  });
  }
}

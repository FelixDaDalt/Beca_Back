import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { colegio, colegioId } from './colegio';
import type { zona, zonaId } from './zona';

export interface zona_localidadAttributes {
  id: number;
  nombre: string;
  id_zona: number;
  borrado?: number;
}

export type zona_localidadPk = "id";
export type zona_localidadId = zona_localidad[zona_localidadPk];
export type zona_localidadOptionalAttributes = "id" | "borrado";
export type zona_localidadCreationAttributes = Optional<zona_localidadAttributes, zona_localidadOptionalAttributes>;

export class zona_localidad extends Model<zona_localidadAttributes, zona_localidadCreationAttributes> implements zona_localidadAttributes {
  id!: number;
  nombre!: string;
  id_zona!: number;
  borrado?: number;

  // zona_localidad belongsTo zona via id_zona
  id_zona_zona!: zona;
  getId_zona_zona!: Sequelize.BelongsToGetAssociationMixin<zona>;
  setId_zona_zona!: Sequelize.BelongsToSetAssociationMixin<zona, zonaId>;
  createId_zona_zona!: Sequelize.BelongsToCreateAssociationMixin<zona>;
  // zona_localidad hasMany colegio via id_zona
  colegios!: colegio[];
  getColegios!: Sequelize.HasManyGetAssociationsMixin<colegio>;
  setColegios!: Sequelize.HasManySetAssociationsMixin<colegio, colegioId>;
  addColegio!: Sequelize.HasManyAddAssociationMixin<colegio, colegioId>;
  addColegios!: Sequelize.HasManyAddAssociationsMixin<colegio, colegioId>;
  createColegio!: Sequelize.HasManyCreateAssociationMixin<colegio>;
  removeColegio!: Sequelize.HasManyRemoveAssociationMixin<colegio, colegioId>;
  removeColegios!: Sequelize.HasManyRemoveAssociationsMixin<colegio, colegioId>;
  hasColegio!: Sequelize.HasManyHasAssociationMixin<colegio, colegioId>;
  hasColegios!: Sequelize.HasManyHasAssociationsMixin<colegio, colegioId>;
  countColegios!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof zona_localidad {
    return zona_localidad.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    id_zona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'zona',
        key: 'id'
      }
    },
    borrado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'zona_localidad',
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
        name: "localidad_a_zona",
        using: "BTREE",
        fields: [
          { name: "id_zona" },
        ]
      },
    ]
  });
  }
}

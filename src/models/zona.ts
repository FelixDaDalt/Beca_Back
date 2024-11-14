import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { zona_localidad, zona_localidadId } from './zona_localidad';

export interface zonaAttributes {
  id: number;
  nombre: string;
  borrado?: number;
}

export type zonaPk = "id";
export type zonaId = zona[zonaPk];
export type zonaOptionalAttributes = "id" | "borrado";
export type zonaCreationAttributes = Optional<zonaAttributes, zonaOptionalAttributes>;

export class zona extends Model<zonaAttributes, zonaCreationAttributes> implements zonaAttributes {
  id!: number;
  nombre!: string;
  borrado?: number;

  // zona hasMany zona_localidad via id_zona
  zona_localidads!: zona_localidad[];
  getZona_localidads!: Sequelize.HasManyGetAssociationsMixin<zona_localidad>;
  setZona_localidads!: Sequelize.HasManySetAssociationsMixin<zona_localidad, zona_localidadId>;
  addZona_localidad!: Sequelize.HasManyAddAssociationMixin<zona_localidad, zona_localidadId>;
  addZona_localidads!: Sequelize.HasManyAddAssociationsMixin<zona_localidad, zona_localidadId>;
  createZona_localidad!: Sequelize.HasManyCreateAssociationMixin<zona_localidad>;
  removeZona_localidad!: Sequelize.HasManyRemoveAssociationMixin<zona_localidad, zona_localidadId>;
  removeZona_localidads!: Sequelize.HasManyRemoveAssociationsMixin<zona_localidad, zona_localidadId>;
  hasZona_localidad!: Sequelize.HasManyHasAssociationMixin<zona_localidad, zona_localidadId>;
  hasZona_localidads!: Sequelize.HasManyHasAssociationsMixin<zona_localidad, zona_localidadId>;
  countZona_localidads!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof zona {
    return zona.init({
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
    borrado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'zona',
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

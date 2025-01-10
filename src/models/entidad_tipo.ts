import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { registroeventos, registroeventosId } from './registroeventos';

export interface entidad_tipoAttributes {
  id: number;
  nombre: string;
}

export type entidad_tipoPk = "id";
export type entidad_tipoId = entidad_tipo[entidad_tipoPk];
export type entidad_tipoCreationAttributes = entidad_tipoAttributes;

export class entidad_tipo extends Model<entidad_tipoAttributes, entidad_tipoCreationAttributes> implements entidad_tipoAttributes {
  id!: number;
  nombre!: string;

  // entidad_tipo hasMany registroeventos via entidad_tipo_id
  registroeventos!: registroeventos[];
  getRegistroeventos!: Sequelize.HasManyGetAssociationsMixin<registroeventos>;
  setRegistroeventos!: Sequelize.HasManySetAssociationsMixin<registroeventos, registroeventosId>;
  addRegistroevento!: Sequelize.HasManyAddAssociationMixin<registroeventos, registroeventosId>;
  addRegistroeventos!: Sequelize.HasManyAddAssociationsMixin<registroeventos, registroeventosId>;
  createRegistroevento!: Sequelize.HasManyCreateAssociationMixin<registroeventos>;
  removeRegistroevento!: Sequelize.HasManyRemoveAssociationMixin<registroeventos, registroeventosId>;
  removeRegistroeventos!: Sequelize.HasManyRemoveAssociationsMixin<registroeventos, registroeventosId>;
  hasRegistroevento!: Sequelize.HasManyHasAssociationMixin<registroeventos, registroeventosId>;
  hasRegistroeventos!: Sequelize.HasManyHasAssociationsMixin<registroeventos, registroeventosId>;
  countRegistroeventos!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof entidad_tipo {
    return entidad_tipo.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'entidad_tipo',
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

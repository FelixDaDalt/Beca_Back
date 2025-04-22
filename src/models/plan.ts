import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { colegio, colegioId } from './colegio';

export interface planAttributes {
  id: number;
  identificador: string;
  nombre: string;
  bonificacion: number;
  editable?: number;
  borrado?: number;
}

export type planPk = "id";
export type planId = plan[planPk];
export type planOptionalAttributes = "id" | "editable" | "borrado";
export type planCreationAttributes = Optional<planAttributes, planOptionalAttributes>;

export class plan extends Model<planAttributes, planCreationAttributes> implements planAttributes {
  id!: number;
  identificador!: string;
  nombre!: string;
  bonificacion!: number;
  editable?: number;
  borrado?: number;

  // plan hasMany colegio via id_plan
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

  static initModel(sequelize: Sequelize.Sequelize): typeof plan {
    return plan.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    identificador: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    bonificacion: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    editable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    borrado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'plan',
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

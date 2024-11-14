import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { beca, becaId } from './beca';
import type { colegio, colegioId } from './colegio';
import type { red_colegio, red_colegioId } from './red_colegio';
import type { registro_red, registro_redId } from './registro_red';

export interface redAttributes {
  id: number;
  fecha_hora?: Date;
  nombre: string;
  foto?: string;
  porcentaje: number;
  caracteristicas?: string;
  borrado?: number;
}

export type redPk = "id";
export type redId = red[redPk];
export type redOptionalAttributes = "id" | "fecha_hora" | "foto" | "porcentaje" | "caracteristicas" | "borrado";
export type redCreationAttributes = Optional<redAttributes, redOptionalAttributes>;

export class red extends Model<redAttributes, redCreationAttributes> implements redAttributes {
  id!: number;
  fecha_hora?: Date;
  nombre!: string;
  foto?: string;
  porcentaje!: number;
  caracteristicas?: string;
  borrado?: number;

  // red hasMany beca via id_red
  becas!: beca[];
  getBecas!: Sequelize.HasManyGetAssociationsMixin<beca>;
  setBecas!: Sequelize.HasManySetAssociationsMixin<beca, becaId>;
  addBeca!: Sequelize.HasManyAddAssociationMixin<beca, becaId>;
  addBecas!: Sequelize.HasManyAddAssociationsMixin<beca, becaId>;
  createBeca!: Sequelize.HasManyCreateAssociationMixin<beca>;
  removeBeca!: Sequelize.HasManyRemoveAssociationMixin<beca, becaId>;
  removeBecas!: Sequelize.HasManyRemoveAssociationsMixin<beca, becaId>;
  hasBeca!: Sequelize.HasManyHasAssociationMixin<beca, becaId>;
  hasBecas!: Sequelize.HasManyHasAssociationsMixin<beca, becaId>;
  countBecas!: Sequelize.HasManyCountAssociationsMixin;
  // red belongsToMany colegio via id_red and id_colegio
  id_colegio_colegios!: colegio[];
  getId_colegio_colegios!: Sequelize.BelongsToManyGetAssociationsMixin<colegio>;
  setId_colegio_colegios!: Sequelize.BelongsToManySetAssociationsMixin<colegio, colegioId>;
  addId_colegio_colegio!: Sequelize.BelongsToManyAddAssociationMixin<colegio, colegioId>;
  addId_colegio_colegios!: Sequelize.BelongsToManyAddAssociationsMixin<colegio, colegioId>;
  createId_colegio_colegio!: Sequelize.BelongsToManyCreateAssociationMixin<colegio>;
  removeId_colegio_colegio!: Sequelize.BelongsToManyRemoveAssociationMixin<colegio, colegioId>;
  removeId_colegio_colegios!: Sequelize.BelongsToManyRemoveAssociationsMixin<colegio, colegioId>;
  hasId_colegio_colegio!: Sequelize.BelongsToManyHasAssociationMixin<colegio, colegioId>;
  hasId_colegio_colegios!: Sequelize.BelongsToManyHasAssociationsMixin<colegio, colegioId>;
  countId_colegio_colegios!: Sequelize.BelongsToManyCountAssociationsMixin;
  // red hasMany red_colegio via id_red
  red_colegios!: red_colegio[];
  getRed_colegios!: Sequelize.HasManyGetAssociationsMixin<red_colegio>;
  setRed_colegios!: Sequelize.HasManySetAssociationsMixin<red_colegio, red_colegioId>;
  addRed_colegio!: Sequelize.HasManyAddAssociationMixin<red_colegio, red_colegioId>;
  addRed_colegios!: Sequelize.HasManyAddAssociationsMixin<red_colegio, red_colegioId>;
  createRed_colegio!: Sequelize.HasManyCreateAssociationMixin<red_colegio>;
  removeRed_colegio!: Sequelize.HasManyRemoveAssociationMixin<red_colegio, red_colegioId>;
  removeRed_colegios!: Sequelize.HasManyRemoveAssociationsMixin<red_colegio, red_colegioId>;
  hasRed_colegio!: Sequelize.HasManyHasAssociationMixin<red_colegio, red_colegioId>;
  hasRed_colegios!: Sequelize.HasManyHasAssociationsMixin<red_colegio, red_colegioId>;
  countRed_colegios!: Sequelize.HasManyCountAssociationsMixin;
  // red hasMany registro_red via id_red
  registro_reds!: registro_red[];
  getRegistro_reds!: Sequelize.HasManyGetAssociationsMixin<registro_red>;
  setRegistro_reds!: Sequelize.HasManySetAssociationsMixin<registro_red, registro_redId>;
  addRegistro_red!: Sequelize.HasManyAddAssociationMixin<registro_red, registro_redId>;
  addRegistro_reds!: Sequelize.HasManyAddAssociationsMixin<registro_red, registro_redId>;
  createRegistro_red!: Sequelize.HasManyCreateAssociationMixin<registro_red>;
  removeRegistro_red!: Sequelize.HasManyRemoveAssociationMixin<registro_red, registro_redId>;
  removeRegistro_reds!: Sequelize.HasManyRemoveAssociationsMixin<registro_red, registro_redId>;
  hasRegistro_red!: Sequelize.HasManyHasAssociationMixin<registro_red, registro_redId>;
  hasRegistro_reds!: Sequelize.HasManyHasAssociationsMixin<registro_red, registro_redId>;
  countRegistro_reds!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof red {
    return red.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    porcentaje: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 75.00
    },
    caracteristicas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'red',
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

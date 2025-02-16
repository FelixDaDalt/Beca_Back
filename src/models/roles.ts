import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { administrador, administradorId } from './administrador';
import type { usuario, usuarioId } from './usuario';

export interface rolesAttributes {
  id: number;
  descripcion: string;
}

export type rolesPk = "id";
export type rolesId = roles[rolesPk];
export type rolesCreationAttributes = rolesAttributes;

export class roles extends Model<rolesAttributes, rolesCreationAttributes> implements rolesAttributes {
  id!: number;
  descripcion!: string;

  // roles hasMany administrador via id_rol
  administradors!: administrador[];
  getAdministradors!: Sequelize.HasManyGetAssociationsMixin<administrador>;
  setAdministradors!: Sequelize.HasManySetAssociationsMixin<administrador, administradorId>;
  addAdministrador!: Sequelize.HasManyAddAssociationMixin<administrador, administradorId>;
  addAdministradors!: Sequelize.HasManyAddAssociationsMixin<administrador, administradorId>;
  createAdministrador!: Sequelize.HasManyCreateAssociationMixin<administrador>;
  removeAdministrador!: Sequelize.HasManyRemoveAssociationMixin<administrador, administradorId>;
  removeAdministradors!: Sequelize.HasManyRemoveAssociationsMixin<administrador, administradorId>;
  hasAdministrador!: Sequelize.HasManyHasAssociationMixin<administrador, administradorId>;
  hasAdministradors!: Sequelize.HasManyHasAssociationsMixin<administrador, administradorId>;
  countAdministradors!: Sequelize.HasManyCountAssociationsMixin;
  // roles hasMany usuario via id_rol
  usuarios!: usuario[];
  getUsuarios!: Sequelize.HasManyGetAssociationsMixin<usuario>;
  setUsuarios!: Sequelize.HasManySetAssociationsMixin<usuario, usuarioId>;
  addUsuario!: Sequelize.HasManyAddAssociationMixin<usuario, usuarioId>;
  addUsuarios!: Sequelize.HasManyAddAssociationsMixin<usuario, usuarioId>;
  createUsuario!: Sequelize.HasManyCreateAssociationMixin<usuario>;
  removeUsuario!: Sequelize.HasManyRemoveAssociationMixin<usuario, usuarioId>;
  removeUsuarios!: Sequelize.HasManyRemoveAssociationsMixin<usuario, usuarioId>;
  hasUsuario!: Sequelize.HasManyHasAssociationMixin<usuario, usuarioId>;
  hasUsuarios!: Sequelize.HasManyHasAssociationsMixin<usuario, usuarioId>;
  countUsuarios!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof roles {
    return roles.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'roles',
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

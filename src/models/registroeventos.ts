import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { administrador, administradorId } from './administrador';
import type { colegio, colegioId } from './colegio';
import type { entidad_tipo, entidad_tipoId } from './entidad_tipo';
import type { roles, rolesId } from './roles';
import type { usuario, usuarioId } from './usuario';

export interface registroeventosAttributes {
  id: number;
  usuario_id?: number;
  administrador_id?: number;
  entidad_tipo_id: number;
  entidad_id: number;
  accion: string;
  descripcion: string;
  ip: string;
  navegador: string;
  fecha_hora: Date;
  id_rol: number;
  id_colegio?: number;
}

export type registroeventosPk = "id";
export type registroeventosId = registroeventos[registroeventosPk];
export type registroeventosOptionalAttributes = "id" | "usuario_id" | "administrador_id" | "fecha_hora" | "id_colegio";
export type registroeventosCreationAttributes = Optional<registroeventosAttributes, registroeventosOptionalAttributes>;

export class registroeventos extends Model<registroeventosAttributes, registroeventosCreationAttributes> implements registroeventosAttributes {
  id!: number;
  usuario_id?: number;
  administrador_id?: number;
  entidad_tipo_id!: number;
  entidad_id!: number;
  accion!: string;
  descripcion!: string;
  ip!: string;
  navegador!: string;
  fecha_hora!: Date;
  id_rol!: number;
  id_colegio?: number;

  // registroeventos belongsTo administrador via administrador_id
  administrador!: administrador;
  getAdministrador!: Sequelize.BelongsToGetAssociationMixin<administrador>;
  setAdministrador!: Sequelize.BelongsToSetAssociationMixin<administrador, administradorId>;
  createAdministrador!: Sequelize.BelongsToCreateAssociationMixin<administrador>;
  // registroeventos belongsTo colegio via id_colegio
  id_colegio_colegio!: colegio;
  getId_colegio_colegio!: Sequelize.BelongsToGetAssociationMixin<colegio>;
  setId_colegio_colegio!: Sequelize.BelongsToSetAssociationMixin<colegio, colegioId>;
  createId_colegio_colegio!: Sequelize.BelongsToCreateAssociationMixin<colegio>;
  // registroeventos belongsTo entidad_tipo via entidad_tipo_id
  entidad_tipo!: entidad_tipo;
  getEntidad_tipo!: Sequelize.BelongsToGetAssociationMixin<entidad_tipo>;
  setEntidad_tipo!: Sequelize.BelongsToSetAssociationMixin<entidad_tipo, entidad_tipoId>;
  createEntidad_tipo!: Sequelize.BelongsToCreateAssociationMixin<entidad_tipo>;
  // registroeventos belongsTo roles via id_rol
  id_rol_role!: roles;
  getId_rol_role!: Sequelize.BelongsToGetAssociationMixin<roles>;
  setId_rol_role!: Sequelize.BelongsToSetAssociationMixin<roles, rolesId>;
  createId_rol_role!: Sequelize.BelongsToCreateAssociationMixin<roles>;
  // registroeventos belongsTo usuario via usuario_id
  usuario!: usuario;
  getUsuario!: Sequelize.BelongsToGetAssociationMixin<usuario>;
  setUsuario!: Sequelize.BelongsToSetAssociationMixin<usuario, usuarioId>;
  createUsuario!: Sequelize.BelongsToCreateAssociationMixin<usuario>;

  static initModel(sequelize: Sequelize.Sequelize): typeof registroeventos {
    return registroeventos.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    administrador_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'administrador',
        key: 'id'
      }
    },
    entidad_tipo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'entidad_tipo',
        key: 'id'
      }
    },
    entidad_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    accion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    navegador: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    id_colegio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'colegio',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'registroeventos',
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
        name: "usuario_id",
        using: "BTREE",
        fields: [
          { name: "usuario_id" },
        ]
      },
      {
        name: "administrador_id",
        using: "BTREE",
        fields: [
          { name: "administrador_id" },
        ]
      },
      {
        name: "registroeventos_a_entidad_tipo",
        using: "BTREE",
        fields: [
          { name: "entidad_tipo_id" },
        ]
      },
      {
        name: "fk_registroeventos_roles",
        using: "BTREE",
        fields: [
          { name: "id_rol" },
        ]
      },
      {
        name: "fk_registroeventos_colegio",
        using: "BTREE",
        fields: [
          { name: "id_colegio" },
        ]
      },
    ]
  });
  }
}

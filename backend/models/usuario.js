"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuario = void 0;
const sequelize_1 = require("sequelize");
class usuario extends sequelize_1.Model {
    static initModel(sequelize) {
        return usuario.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            id_colegio: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'colegio',
                    key: 'id'
                }
            },
            id_rol: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id'
                }
            },
            dni: {
                type: sequelize_1.DataTypes.STRING(10),
                allowNull: false
            },
            password: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            apellido: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            telefono: {
                type: sequelize_1.DataTypes.STRING(18),
                allowNull: true,
                defaultValue: "No Definido"
            },
            celular: {
                type: sequelize_1.DataTypes.STRING(18),
                allowNull: true,
                defaultValue: "No Definido"
            },
            email: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                defaultValue: "No Definido"
            },
            cambiarPass: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            tyc: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            suspendido: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            borrado: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            foto: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                defaultValue: "\/uploads\/avatar\/default.png"
            }
        }, {
            sequelize,
            tableName: 'usuario',
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
                    name: "usuario_a_colegio",
                    using: "BTREE",
                    fields: [
                        { name: "id_colegio" },
                    ]
                },
                {
                    name: "usuario_a_roles",
                    using: "BTREE",
                    fields: [
                        { name: "id_rol" },
                    ]
                },
            ]
        });
    }
}
exports.usuario = usuario;

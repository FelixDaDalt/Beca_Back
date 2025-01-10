"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.administrador = void 0;
const sequelize_1 = require("sequelize");
class administrador extends sequelize_1.Model {
    static initModel(sequelize) {
        return administrador.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            dni: {
                type: sequelize_1.DataTypes.STRING(255),
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
            celular: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "No Definido"
            },
            telefono: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "No Definido"
            },
            id_rol: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                references: {
                    model: 'roles',
                    key: 'id'
                }
            },
            cambiarPass: {
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
            },
            email: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "No Definido"
            }
        }, {
            sequelize,
            tableName: 'administrador',
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
                    name: "administrador_a_roles",
                    using: "BTREE",
                    fields: [
                        { name: "id_rol" },
                    ]
                },
            ]
        });
    }
}
exports.administrador = administrador;

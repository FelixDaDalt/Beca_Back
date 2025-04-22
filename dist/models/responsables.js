"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responsables = void 0;
const sequelize_1 = require("sequelize");
class responsables extends sequelize_1.Model {
    static initModel(sequelize) {
        return responsables.init({
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
            nombre: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            apellido: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            dni: {
                type: sequelize_1.DataTypes.STRING(10),
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
            }
        }, {
            sequelize,
            tableName: 'responsables',
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
                    name: "fk_responsables_colegio",
                    using: "BTREE",
                    fields: [
                        { name: "id_colegio" },
                    ]
                },
            ]
        });
    }
}
exports.responsables = responsables;

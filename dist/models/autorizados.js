"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autorizados = void 0;
const sequelize_1 = require("sequelize");
class autorizados extends sequelize_1.Model {
    static initModel(sequelize) {
        return autorizados.init({
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
            },
            borrado: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            suspendido: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            cantidad: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            utilizadas: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            }
        }, {
            sequelize,
            tableName: 'autorizados',
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
exports.autorizados = autorizados;

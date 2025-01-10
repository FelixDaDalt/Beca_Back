"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colegio = void 0;
const sequelize_1 = require("sequelize");
class colegio extends sequelize_1.Model {
    static initModel(sequelize) {
        return colegio.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            cuit: {
                type: sequelize_1.DataTypes.STRING(11),
                allowNull: false
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            direccion_calle: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            direccion_numero: {
                type: sequelize_1.DataTypes.STRING(8),
                allowNull: false
            },
            localidad: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            provincia: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            cp: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            id_zona: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'zona_localidad',
                    key: 'id'
                }
            },
            telefono: {
                type: sequelize_1.DataTypes.STRING(18),
                allowNull: false
            },
            url: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            email: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                defaultValue: "No Definido"
            },
            terminos: {
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
                defaultValue: "\/uploads\/colegio\/default.png"
            }
        }, {
            sequelize,
            tableName: 'colegio',
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
                    name: "fk_colegio_zona_localidad",
                    using: "BTREE",
                    fields: [
                        { name: "id_zona" },
                    ]
                },
            ]
        });
    }
}
exports.colegio = colegio;

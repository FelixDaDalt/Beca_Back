"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zona_localidad = void 0;
const sequelize_1 = require("sequelize");
class zona_localidad extends sequelize_1.Model {
    static initModel(sequelize) {
        return zona_localidad.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            id_zona: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'zona',
                    key: 'id'
                }
            },
            borrado: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            }
        }, {
            sequelize,
            tableName: 'zona_localidad',
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
                    name: "localidad_a_zona",
                    using: "BTREE",
                    fields: [
                        { name: "id_zona" },
                    ]
                },
            ]
        });
    }
}
exports.zona_localidad = zona_localidad;

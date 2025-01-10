"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beca_resolucion = void 0;
const sequelize_1 = require("sequelize");
class beca_resolucion extends sequelize_1.Model {
    static initModel(sequelize) {
        return beca_resolucion.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'beca_resolucion',
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
exports.beca_resolucion = beca_resolucion;

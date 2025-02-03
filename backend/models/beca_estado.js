"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beca_estado = void 0;
const sequelize_1 = require("sequelize");
class beca_estado extends sequelize_1.Model {
    static initModel(sequelize) {
        return beca_estado.init({
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
            tableName: 'beca_estado',
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
exports.beca_estado = beca_estado;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entidad_tipo = void 0;
const sequelize_1 = require("sequelize");
class entidad_tipo extends sequelize_1.Model {
    static initModel(sequelize) {
        return entidad_tipo.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'entidad_tipo',
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
exports.entidad_tipo = entidad_tipo;

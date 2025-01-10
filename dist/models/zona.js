"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zona = void 0;
const sequelize_1 = require("sequelize");
class zona extends sequelize_1.Model {
    static initModel(sequelize) {
        return zona.init({
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
            borrado: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            }
        }, {
            sequelize,
            tableName: 'zona',
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
exports.zona = zona;

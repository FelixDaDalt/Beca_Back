"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roles = void 0;
const sequelize_1 = require("sequelize");
class roles extends sequelize_1.Model {
    static initModel(sequelize) {
        return roles.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            descripcion: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'roles',
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
exports.roles = roles;

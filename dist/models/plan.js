"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plan = void 0;
const sequelize_1 = require("sequelize");
class plan extends sequelize_1.Model {
    static initModel(sequelize) {
        return plan.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            identificador: {
                type: sequelize_1.DataTypes.STRING(6),
                allowNull: false
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            bonificacion: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false
            },
            editable: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 1
            },
            borrado: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            }
        }, {
            sequelize,
            tableName: 'plan',
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
exports.plan = plan;

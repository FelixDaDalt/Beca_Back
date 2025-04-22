"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forma_pago = void 0;
const sequelize_1 = require("sequelize");
class forma_pago extends sequelize_1.Model {
    static initModel(sequelize) {
        return forma_pago.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            identificador: {
                type: sequelize_1.DataTypes.STRING(1),
                allowNull: false
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            descuento: {
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
            tableName: 'forma_pago',
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
exports.forma_pago = forma_pago;

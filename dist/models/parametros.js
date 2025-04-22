"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parametros = void 0;
const sequelize_1 = require("sequelize");
class parametros extends sequelize_1.Model {
    static initModel(sequelize) {
        return parametros.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false
            },
            valor: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false
            },
            clave: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false
            },
            descripcion: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'parametros',
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
exports.parametros = parametros;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.red_colegio = void 0;
const sequelize_1 = require("sequelize");
class red_colegio extends sequelize_1.Model {
    static initModel(sequelize) {
        return red_colegio.init({
            id_colegio: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'colegio',
                    key: 'id'
                }
            },
            anfitrion: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            id_red: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'red',
                    key: 'id'
                }
            },
            bp: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            btp: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            db: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            dbu: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            dbd: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            bsp: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            bsa: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            bde: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            borrado: {
                type: sequelize_1.DataTypes.TINYINT,
                allowNull: true,
                defaultValue: 0
            }
        }, {
            sequelize,
            tableName: 'red_colegio',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "id_colegio" },
                        { name: "id_red" },
                    ]
                },
                {
                    name: "id_red",
                    using: "BTREE",
                    fields: [
                        { name: "id_red" },
                    ]
                },
            ]
        });
    }
}
exports.red_colegio = red_colegio;

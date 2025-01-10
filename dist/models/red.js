"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.red = void 0;
const Sequelize = __importStar(require("sequelize"));
const sequelize_1 = require("sequelize");
class red extends sequelize_1.Model {
    static initModel(sequelize) {
        return red.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            fecha_hora: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.Sequelize.fn('current_timestamp')
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            foto: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                defaultValue: "\/uploads\/redes\/default.png"
            },
            porcentaje: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 75.00
            },
            caracteristicas: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            borrado: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            }
        }, {
            sequelize,
            tableName: 'red',
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
exports.red = red;

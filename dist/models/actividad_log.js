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
exports.actividad_log = void 0;
const Sequelize = __importStar(require("sequelize"));
const sequelize_1 = require("sequelize");
class actividad_log extends sequelize_1.Model {
    static initModel(sequelize) {
        return actividad_log.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            usuario_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'usuario',
                    key: 'id'
                }
            },
            admin_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'administrador',
                    key: 'id'
                }
            },
            accion: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            descripcion: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            ip: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            navegador: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            query_params: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            fecha: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.fn('current_timestamp')
            },
            id_rol: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            id_colegio: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'actividad_log',
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
                {
                    name: "fk_actividad_log_administrador",
                    using: "BTREE",
                    fields: [
                        { name: "admin_id" },
                    ]
                },
                {
                    name: "fk_actividad_log_usuario",
                    using: "BTREE",
                    fields: [
                        { name: "usuario_id" },
                    ]
                },
            ]
        });
    }
}
exports.actividad_log = actividad_log;

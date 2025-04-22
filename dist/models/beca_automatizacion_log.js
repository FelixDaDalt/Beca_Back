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
exports.beca_automatizacion_log = void 0;
const Sequelize = __importStar(require("sequelize"));
const sequelize_1 = require("sequelize");
class beca_automatizacion_log extends sequelize_1.Model {
    static initModel(sequelize) {
        return beca_automatizacion_log.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            id_beca_solicitud: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'beca_solicitud',
                    key: 'id'
                }
            },
            id_estado_anterior: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            id_estado_nuevo: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            fecha_registro: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.fn('current_timestamp')
            },
            tipo_notificacion: {
                type: sequelize_1.DataTypes.ENUM('VENCIDA', 'POR_VENCER', 'BAJA', 'EJECUCION'),
                allowNull: false
            },
            email_colegio_solicitante: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            email_colegio_ofrecio: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            motivo: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            id_ejecucion: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'beca_automatizacion_ejecucion',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            tableName: 'beca_automatizacion_log',
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
                    name: "id_beca_solicitud",
                    using: "BTREE",
                    fields: [
                        { name: "id_beca_solicitud" },
                    ]
                },
                {
                    name: "fk_beca_automatizacion_log_beca_automatizacion_ejecucion",
                    using: "BTREE",
                    fields: [
                        { name: "id_ejecucion" },
                    ]
                },
            ]
        });
    }
}
exports.beca_automatizacion_log = beca_automatizacion_log;

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
exports.beca_solicitud = void 0;
const Sequelize = __importStar(require("sequelize"));
const sequelize_1 = require("sequelize");
class beca_solicitud extends sequelize_1.Model {
    static initModel(sequelize) {
        return beca_solicitud.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            id_beca: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'beca',
                    key: 'id'
                }
            },
            id_colegio_solic: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'colegio',
                    key: 'id'
                }
            },
            id_usuario_solic: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'usuario',
                    key: 'id'
                }
            },
            fecha_hora: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.Sequelize.fn('current_timestamp')
            },
            alumno_nombre: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            alumno_apellido: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            alumno_fecha: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false
            },
            alumno_dni: {
                type: sequelize_1.DataTypes.STRING(10),
                allowNull: false
            },
            detalle: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            id_resolucion: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                references: {
                    model: 'beca_resolucion',
                    key: 'id'
                }
            },
            res_comentario: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            id_usuario_reso: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'usuario',
                    key: 'id'
                }
            },
            reso_fecha_hora: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.Sequelize.fn('current_timestamp')
            },
            id_estado: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                references: {
                    model: 'beca_estado',
                    key: 'id'
                }
            },
            id_usuario_baja: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'usuario',
                    key: 'id'
                }
            },
            baja_fecha_hora: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.Sequelize.fn('current_timestamp')
            },
            baja_comentario: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            sinLeer: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 1
            },
            sinLeerSolicitante: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            id_pariente: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'usuario',
                    key: 'id'
                }
            },
            notificarPorVencer: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            notificarVencida: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            }
        }, {
            sequelize,
            tableName: 'beca_solicitud',
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
                    name: "solicitud_beca_a_becas_publicadas",
                    using: "BTREE",
                    fields: [
                        { name: "id_beca" },
                    ]
                },
                {
                    name: "solicitud_beca_a_colegio",
                    using: "BTREE",
                    fields: [
                        { name: "id_colegio_solic" },
                    ]
                },
                {
                    name: "solicitud_beca_a_usuario",
                    using: "BTREE",
                    fields: [
                        { name: "id_usuario_solic" },
                    ]
                },
                {
                    name: "fk_beca_solicitud_beca_resolucion",
                    using: "BTREE",
                    fields: [
                        { name: "id_resolucion" },
                    ]
                },
                {
                    name: "beca_solicitud_res_a_usuario",
                    using: "BTREE",
                    fields: [
                        { name: "id_usuario_reso" },
                    ]
                },
                {
                    name: "fk_beca_solicitud_beca_estado",
                    using: "BTREE",
                    fields: [
                        { name: "id_estado" },
                    ]
                },
                {
                    name: "fk_beca_solicitud_usuario",
                    using: "BTREE",
                    fields: [
                        { name: "id_usuario_baja" },
                    ]
                },
                {
                    name: "fk_beca_solicitud_usuario_0",
                    using: "BTREE",
                    fields: [
                        { name: "id_pariente" },
                    ]
                },
            ]
        });
    }
}
exports.beca_solicitud = beca_solicitud;

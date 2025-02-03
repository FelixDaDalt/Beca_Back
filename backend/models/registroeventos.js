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
exports.registroeventos = void 0;
const Sequelize = __importStar(require("sequelize"));
const sequelize_1 = require("sequelize");
class registroeventos extends sequelize_1.Model {
    static initModel(sequelize) {
        return registroeventos.init({
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
            administrador_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'administrador',
                    key: 'id'
                }
            },
            entidad_tipo_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'entidad_tipo',
                    key: 'id'
                }
            },
            entidad_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            accion: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            descripcion: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            ip: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: false
            },
            navegador: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            fecha_hora: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.fn('current_timestamp')
            },
            id_rol: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id'
                }
            },
            id_colegio: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'colegio',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            tableName: 'registroeventos',
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
                    name: "usuario_id",
                    using: "BTREE",
                    fields: [
                        { name: "usuario_id" },
                    ]
                },
                {
                    name: "administrador_id",
                    using: "BTREE",
                    fields: [
                        { name: "administrador_id" },
                    ]
                },
                {
                    name: "registroeventos_a_entidad_tipo",
                    using: "BTREE",
                    fields: [
                        { name: "entidad_tipo_id" },
                    ]
                },
                {
                    name: "fk_registroeventos_roles",
                    using: "BTREE",
                    fields: [
                        { name: "id_rol" },
                    ]
                },
                {
                    name: "fk_registroeventos_colegio",
                    using: "BTREE",
                    fields: [
                        { name: "id_colegio" },
                    ]
                },
            ]
        });
    }
}
exports.registroeventos = registroeventos;

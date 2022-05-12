import { DataTypes, Sequelize } from "sequelize";
import config from "../config";
const sequelize = config.DATABASE;

export const Cred = sequelize.define(
    "Cred", {
        key: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.JSON,
        }

    }, {
        tableName: "Creds",
        timestamps: false,
    }
);

export const Key = sequelize.define(
    "Key", {
        key: {
            type: DataTypes.STRING(1000000),
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING(1000000),
        },
        type: {
            type: DataTypes.STRING(1000000),
        }

    }, {
        tableName: "Keys",
        timestamps: false,
    }
);
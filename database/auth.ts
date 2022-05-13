import config from "../config";
import { DataTypes, InferAttributes, Model, InferCreationAttributes, Sequelize } from "sequelize";

const sequelize: Sequelize = config.DATABASE;

class Cred extends Model<InferAttributes<Cred>, InferCreationAttributes<Cred>> {
    declare key: string;
    declare value: string;
}

Cred.init({
        key: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.JSON,
        }

    }, { sequelize,
        tableName: "Creds",
        timestamps: false
    }
);

class Key extends Model<InferAttributes<Key>, InferCreationAttributes<Key>> {
    declare key: string;
    declare value: string;
    declare type: string;
}

Key.init({
        key: {
            type: DataTypes.STRING(1000000),
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING(1000000)
        },
        type: {
            type: DataTypes.STRING(1000000),
        }
    }, {
        sequelize,
        tableName: "Keys",
        timestamps: false,
    }
);

export {Cred, Key};
import config from "../config";
import { DataTypes, InferAttributes, Model, InferCreationAttributes, Sequelize } from "sequelize";

const sequelize: Sequelize = config.DATABASE;

class Auth extends Model<InferAttributes<Auth>, InferCreationAttributes<Auth>> {
    declare key: string;
    declare value: string;
    declare type: string;
}

Auth.init({
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
        tableName: "Authentication",
        timestamps: false,
    }
);

export {Auth};
import config from "../config";
import { DataTypes, InferAttributes, Model, InferCreationAttributes, Sequelize } from "sequelize";

const sequelize = config.DATABASE;

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare JID: string;
}

User.init({
        JID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, { sequelize, tableName: "Users"});

async function addUser(jid: string | null = null) {
    User.findOrCreate({
        where: {
            JID: jid
        },
    });

}

async function getUser(jid: string | null = null) {
    var Msg = await User.findAll({
        where: {
            JID: jid
        },
    });

    if (Msg.length < 1) {
        return false;
    } else {
        return true;
    }
}

export = {
    User: User,
    addUser: addUser,
    getUser: getUser
};
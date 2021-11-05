const config = require("../config");
const { DataTypes } = require("sequelize");
const sequelize = config.DATABASE;

const User = sequelize.define(
    "User", {
        JID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: "Users",
    }
);

async function addUser(jid = null) {
    User.findOrCreate({
        where: {
            JID: jid
        },
    });

}

async function getUser(jid = null) {
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

module.exports = {
    User: User,
    addUser: addUser,
    getUser: getUser
};
const config = require("../config");
const { DataTypes } = require("sequelize");
const sequelize = config.DATABASE;

const Module = sequelize.define(
    "Module",
    {
        MODULE_NAME: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CHAT_ID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "Module",
    }
);

async function disableModule(name = "", jid = "") {
    Module.findOrCreate({
        where: {
            MODULE_NAME: name,
            CHAT_ID: jid,
        },
    });
}

async function isDisabled(name = "", jid = "") {
    var Msg = await Module.findAll({
        where: {
            MODULE_NAME: name,
            CHAT_ID: jid,
        },
    });

    if (Msg.length < 1) {
        return false;
    } else {
        return true;
    }
}

async function enableModule(name = "", jid = "") {
    var Msg = await Module.findAll({
        where: {
            MODULE_NAME: name,
            CHAT_ID: jid,
        },
    });
    if (Msg.length < 1) {
        return false;
    } else {
        return await Msg[0].destroy();
    }
}

module.exports = {
    Module: Module,
    disableModule: disableModule,
    isDisabled: isDisabled,
    enableModule: enableModule,
};

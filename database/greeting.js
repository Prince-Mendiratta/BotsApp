const config = require("../config");
const { DataTypes } = require("sequelize");
const sequelize = config.DATABASE;

const Greeting = sequelize.define(
    "Greeting", {
        chat: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        switched: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "ON",
        },
        greetingType: {
            type: DataTypes.TEXT,
        },
        message: {
            type: DataTypes.TEXT,
        },
    }, {
        tableName: "Greetings",
    }
);

async function getMessage(jid = null, type) {
    var Msg = await Greeting.findAll({
        where: {
            chat: jid,
            greetingType: type,
        },
    });

    if (Msg.length < 1) {
        return false;
    } else {
        return Msg[0].dataValues;
    }
}

async function checkSettings(jid = null, type) {
    var Msg = await Greeting.findAll({
        where: {
            chat: jid,
            greetingType: type,
        },
    });

    if (Msg.length < 1) {
        return false;
    } else {
        if (Msg[0].dataValues.switched === "ON") {
            return "ON";
        } else {
            return "OFF";
        }
    }
}

async function changeSettings(groupJid = null, isWorking) {
    await Greeting.update({
        switched: isWorking
    }, {
        where: {
            chat: groupJid,
        },
    });
}

async function setWelcome(jid = null, text = null) {
    Greeting.findOrCreate({
        where: {
            chat: jid,
            greetingType: "welcome",
        },
        defaults: {
            chat: jid,
            switched: "ON",
            greetingType: "welcome",
            message: text,
        },
    });
}
async function setGoodbye(jid, text = null) {
    Greeting.findOrCreate({
        where: {
            chat: jid,
            greetingType: "goodbye",
        },
        defaults: {
            chat: jid,
            switched: "ON",
            greetingType: "goodbye",
            message: text,
        },
    });
}

async function deleteMessage(jid = null, type = null) {
    var Msg = await Greeting.findAll({
        where: {
            chat: jid,
            greetingType: type,
        },
    });
    if (Msg.length < 1) {
        return false;
    } else {
        return await Msg[0].destroy();
    }
}

module.exports = {
    Greeting: Greeting,
    getMessage: getMessage,
    changeSettings: changeSettings,
    checkSettings: checkSettings,
    setWelcome: setWelcome,
    setGoodbye: setGoodbye,
    deleteMessage: deleteMessage,
};
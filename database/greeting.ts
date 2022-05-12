import config from "../config";
import { DataTypes, InferAttributes, Model, InferCreationAttributes, Sequelize } from "sequelize";

const sequelize: Sequelize = config.DATABASE;

class Greeting extends Model<InferAttributes<Greeting>, InferCreationAttributes<Greeting>> {
    declare chat: string;
    declare switched: string;
    declare greetingType: string | null;
    declare message: string | null;
}

Greeting.init({
    chat: {
        type: DataTypes.STRING,
        allowNull: false
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
}, {sequelize, tableName: "Greetings"});

async function getMessage(jid: string | null = null, type: string) : Promise<boolean | Greeting> {
    var Msg = await Greeting.findAll({
        where: {
            chat: jid,
            greetingType: type,
        },
        raw: true
    });

    if (Msg.length < 1) {
        return false;
    } else {
        return Msg[0];
    }
}

async function checkSettings(jid: string | null = null, type: string) : Promise<boolean | string> {
    var Msg = await Greeting.findAll({
        where: {
            chat: jid,
            greetingType: type,
        },
        raw: true
    });

    if (Msg.length < 1) {
        return false;
    } else {
        if (Msg[0].switched === "ON") {
            return "ON";
        } else {
            return "OFF";
        }
    }
}

async function changeSettings(groupJid: string = null, isWorking: string) : Promise<void> {
    await Greeting.update({
        switched: isWorking
    }, {
        where: {
            chat: groupJid,
        },
    });
}

async function setWelcome(jid: string = null, text: string = null) : Promise<void> {
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
async function setGoodbye(jid: string, text: string = null) : Promise<void> {
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

async function deleteMessage(jid: string = null, type: string = null) : Promise<boolean | void> {
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

export = {
    Greeting: Greeting,
    getMessage: getMessage,
    changeSettings: changeSettings,
    checkSettings: checkSettings,
    setWelcome: setWelcome,
    setGoodbye: setGoodbye,
    deleteMessage: deleteMessage,
};
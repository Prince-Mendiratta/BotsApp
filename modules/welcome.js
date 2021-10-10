const { MessageType } = require("@adiwajshing/baileys");
const Greetings = require("../database/greeting");
const Strings = require("../lib/db");
const WELCOME = Strings.welcome;

module.exports = {
  name: "welcome",
  description: WELCOME.DESCRIPTION,
  extendedDescription: WELCOME.EXTENDED_DESCRIPTION,
  async handle(client, chat, BotsApp, args) {
    if (!BotsApp.isGroup) {
        client.sendMessage(BotsApp.chatId, WELCOME.NOT_A_GROUP, MessageType.text);
        return;
    }
    var Msg = await Greetings.getMessage(BotsApp.chatId, "welcome");
    if (args.length == 0) {
        var enable = await Greetings.checkSettings(BotsApp.chatId, "welcome");
        try {
            if (enable === false || enable === undefined) {
                client.sendMessage(
                    BotsApp.chatId,
                    WELCOME.SET_WELCOME_FIRST,
                    MessageType.text
                );
                return;
            } else if (enable === "OFF") {
                console.log("Greetings are off");
                client.sendMessage(
                    BotsApp.chatId,
                    WELCOME.CURRENTLY_DISABLED,
                    MessageType.text
                );
                client.sendMessage(BotsApp.chatId, Msg.message, MessageType.text);
                return;
            }
    
            client.sendMessage(
                BotsApp.chatId,
                WELCOME.CURRENTLY_ENABLED,
                MessageType.text
            );
            client.sendMessage(BotsApp.chatId, Msg.message, MessageType.text);
        } catch (err) {
            console.log("ERROR: " + err);
        }
    } else {
        if (args[0] === "OFF") {
            switched = args[0];
            await Greetings.changeSettings(BotsApp.chatId, switched);
            client.sendMessage(
                BotsApp.chatId,
                WELCOME.GREETINGS_UNENABLED,
                MessageType.text
            );
            return;
        }
        if (args[0] === "ON") {
            switched = args[0];
            await Greetings.changeSettings(BotsApp.chatId, switched);
            client.sendMessage(
                BotsApp.chatId,
                WELCOME.GREETINGS_ENABLED,
                MessageType.text
            );
    
            return;
        }
        if (args[0] === "delete") {
            var Msg = await Greetings.deleteMessage(BotsApp.chatId, "welcome");
            if (Msg === false || Msg === undefined) {
                client.sendMessage(
                    BotsApp.chatId,
                    WELCOME.SET_WELCOME_FIRST,
                    MessageType.text
                );
                return;
            }
    
            await client.sendMessage(
                BotsApp.chatId,
                WELCOME.WELCOME_DELETED,
                MessageType.text
            );
    
            return;
        }
        text = BotsApp.body.replace(
            BotsApp.body[0] + BotsApp.commandName + " ",
            ""
        );
        if (Msg === false || Msg === undefined) {
            await Greetings.setWelcome(BotsApp.chatId, text);
            await client.sendMessage(
                BotsApp.chatId,
                WELCOME.WELCOME_UPDATED,
                MessageType.text
            );
    
            return;
        } else {
            await Greetings.deleteMessage(BotsApp.chatId, "welcome");
            await Greetings.setWelcome(BotsApp.chatId, text);
            await client.sendMessage(
                BotsApp.chatId,
                WELCOME.WELCOME_UPDATED,
                MessageType.text
            );
    
            return;
        }
    }
    },
};
const { MessageType } = require("@adiwajshing/baileys");
const Strings = require("../lib/db");
const Greetings = require("../database/greeting");
const GOODBYE = Strings.goodbye;

module.exports = {
  name: "goodbye",
  description: GOODBYE.DESCRIPTION,
  extendedDescription: GOODBYE.EXTENDED_DESCRIPTION,
  async handle(client, chat, BotsApp, args) {
    if (!BotsApp.isGroup) {
        client.sendMessage(BotsApp.chatId, GOODBYE.NOT_A_GROUP, MessageType.text);
        return;
    }
    if (args.length == 0) {
        var enabled = await Greetings.checkSettings(BotsApp.chatId, "goodbye");
        var Msg = await Greetings.getMessage(BotsApp.chatId, "goodbye");
        try {
            if (enabled === false || enabled === undefined) {
                client.sendMessage(
                    BotsApp.chatId,
                    GOODBYE.SET_GOODBYE_FIRST,
                    MessageType.text
                );
                return;
            } else if (enabled === "OFF") {
                console.log("Greetings are off");
                client.sendMessage(
                    BotsApp.chatId,
                    GOODBYE.CURRENTLY_DISABLED,
                    MessageType.text
                );
                client.sendMessage(BotsApp.chatId, Msg.message, MessageType.text);
                return;
            }
    
            client.sendMessage(
                BotsApp.chatId,
                GOODBYE.CURRENTLY_ENABLED,
                MessageType.text
            );
            client.sendMessage(BotsApp.chatId, Msg.message, MessageType.text);
        } catch (err) {
            console.log("ERROR: " + err);
        }
    } else {
        if (args[0] === "OFF" || args[0] === "off") {
            switched = "OFF";
            await Greetings.changeSettings(BotsApp.chatId, switched);
            client.sendMessage(
                BotsApp.chatId,
                GOODBYE.GREETINGS_UNENABLED,
                MessageType.text
            );
            return;
        }
        if (args[0] === "ON" || args[0] === "on") {
            switched = "ON";
            await Greetings.changeSettings(BotsApp.chatId, switched);
            client.sendMessage(
                BotsApp.chatId,
                GOODBYE.GREETINGS_ENABLED,
                MessageType.text
            );
            return;
        }
        if (args[0] === "delete") {
            var Msg = await Greetings.deleteMessage(BotsApp.chatId, "goodbye");
            if (Msg === false || Msg === undefined) {
                client.sendMessage(
                    BotsApp.chatId,
                    GOODBYE.SET_GOODBYE_FIRST,
                    MessageType.text
                );
                return;
            }
            await client.sendMessage(
                BotsApp.chatId,
                GOODBYE.GOODBYE_DELETED,
                MessageType.text
            );
    
            return;
        }
        text = BotsApp.body.replace(
            BotsApp.body[0] + BotsApp.commandName + " ",
            ""
        );
    
        var Msg = await Greetings.getMessage(BotsApp.chatId, "goodbye");
        if (Msg === false || Msg === undefined) {
            await Greetings.setGoodbye(BotsApp.chatId, text);
            await client.sendMessage(
                BotsApp.chatId,
                GOODBYE.GOODBYE_UPDATED,
                MessageType.text
            );
    
            return;
        } else {
            await Greetings.deleteMessage(BotsApp.chatId, "goodbye");
            await Greetings.setGoodbye(BotsApp.chatId, text);
            await client.sendMessage(
                BotsApp.chatId,
                GOODBYE.GOODBYE_UPDATED,
                MessageType.text
            );
            return;
        }
    }
    },
};

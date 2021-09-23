const { MessageType } = require("@adiwajshing/baileys")
const chalk = require('chalk');
const STRINGS =require("../lib/db.js");

module.exports = {
    name: "remove",
    description: STRINGS.remove.DESCRIPTION,
    extendedDescription: STRINGS.remove.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, STRINGS.general.NOT_A_GROUP, MessageType.text);
            return;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.chatId, STRINGS.general.BOT_NOT_ADMIN, MessageType.text);
            return;
        }
        if (args[0][0] == '@') {
            const number = args[0].substring(1);
            if(isNaN(number)){
                client.sendMessage(BotsApp.chatId, STRINGS.remove.INPUT_ERROR, MessageType.text);
            return;
            }
            client.groupRemove(BotsApp.chatId, [number + '@s.whatsapp.net'])
            return;
        }
        if (BotsApp.isReply) {
            let PersonToRemove = chat.message.extendedTextMessage.contextInfo.participant;
            try {
                if (PersonToRemove) {
                    client.groupRemove(BotsApp.chatId, [PersonToRemove])
                }
            } catch (err) {
                console.log(chalk.red("[ERROR] ", err));
            }
            return;
        }
        client.sendMessage(BotsApp.chatId, STRINGS.remove.INPUT_ERROR, MessageType.text);
        return;
    }

}
const {
    MessageType
} = require("@adiwajshing/baileys")
const STRINGS = require("../lib/db.js");

module.exports = {
    name: "disappear",
    description: "",
    extendedDescription: "",
    async handle(client, chat, BotsApp, args) {
        if (BotsApp.isGroup) {
            if (!BotsApp.isBotGroupAdmin) {
                client.sendMessage(BotsApp.chatId, STRINGS.general.BOT_NOT_ADMIN, MessageType.text);
                return;
            }
        }
        if (args[0] == 'on') {
            var time = 7 * 24 * 60 * 60;
        }
        else if (args[0] == 'off') {
            var time = 0;
        } else {
            client.sendMessage(BotsApp.chatId, STRINGS.disappear.CMD_ERR, MessageType.text);
            return;
        }
        try {
            await client.toggleDisappearingMessages(
                BotsApp.chatId,
                time
            )
        } catch (err) {
            console.log(err);
        }
    }
}
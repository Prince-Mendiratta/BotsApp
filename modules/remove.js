const { MessageType } = require("@adiwajshing/baileys")
const chalk = require('chalk');

module.exports = {
    name: "remove",
    description: "OOF",
    extendedDescription: "Not OOOf",
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.from, "*This is not a group.😑*", MessageType.text);
            return 0;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.from, "*I am not group admin.*", MessageType.text);
            return 0;
        }
        if (BotsApp.isReply) {
            let PersonToRemove = chat.messages.all()[0].message.extendedTextMessage.contextInfo.participant;
            try {
                if (PersonToRemove) {
                    client.groupRemove(BotsApp.from, [PersonToRemove])
                }
            } catch (err) {
                console.log(chalk.red("[ERROR] ", err));
            }
            return 0;
        }
        client.sendMessage(BotsApp.from, "*Reply to the person you want to remove. 😈*", MessageType.text);
        return 0;
    }

}
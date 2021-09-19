const { MessageType } = require("@adiwajshing/baileys")
const chalk = require('chalk');

module.exports = {
    name: "remove",
    description: "OOF",
    extendedDescription: "Not OOOf",
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.from, "*This is not a group.😑*", MessageType.text);
            return;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.from, "*I am not group admin.*", MessageType.text);
            return;
        }
        if (args[0][0] == '@') {
            const number = args[0].substring(1);
           if(isNaN(number)){
            client.sendMessage(BotsApp.from, "*Reply to the person you want to remove or tag them. 😈*", MessageType.text);
            return;
           }
            client.groupRemove(BotsApp.from, [number + '@s.whatsapp.net'])
            return;
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
            return;
        }
        client.sendMessage(BotsApp.from, "*Reply to the person you want to remove or tag them. 😈*", MessageType.text);
        return;
    }

}
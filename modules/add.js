const { MessageType } = require("@adiwajshing/baileys")
const chalk = require('chalk');
const STRINGS =require("../lib/db.js");

module.exports = {
    name: "add",
    description: STRINGS.add.DESCRIPTION,
    extendedDescription: STRINGS.add.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId,STRINGS.general.NOT_A_GROUP , MessageType.text);
            return;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.chatId, STRINGS.general.BOT_NOT_ADMIN, MessageType.text);
            return;
        }
        if (!args[0]) {
            client.sendMessage(BotsApp.chatId, STRINGS.add.NO_ARG_ERROR, MessageType.text);
            return;
        }
        try { 
            let number;
            if (isNaN(args[0]) || args[0][0] === '+') {
                client.sendMessage(BotsApp.chatId, STRINGS.add.NUMBER_SYNTAX_ERROR, MessageType.text);
                return;
            }
            if (args[0].length == 10 && !isNaN(args[0])) {
                number = '91' + args[0];
            }
            else{
                number = args[0];
            }
            const request = client.groupAdd(BotsApp.chatId, [BotsApp.owner, number + '@s.whatsapp.net']);
            const response = await request;
            if (response[number + '@c.us'] == 408) {
                client.sendMessage(BotsApp.chatId, STRINGS.add.NO_24HR_BAN, MessageType.text)
                console.log(response)
                return;
            }else if(response[number + '@c.us'] == 409){
                client.sendMessage(BotsApp.chatId, STRINGS.add.ALREADY_MEMBER, MessageType.text);
                return;
            }
            client.sendMessage(BotsApp.chatId, ("```" + number + STRINGS.add.SUCCESS + "```"), MessageType.text)

        } catch (err) {
            console.log(err)
            if (err.status == 400) {
                client.sendMessage(BotsApp.chatId, STRINGS.add.NOT_ON_WHATSAPP, MessageType.text)
                return;
            }
            console.log(chalk.red("[ERROR] ", err));
        }
        return;
    }
}
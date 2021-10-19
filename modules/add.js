const { MessageType } = require("@adiwajshing/baileys")
const chalk = require('chalk');
const Strings = require("../lib/db.js");
const ADD = Strings.add;

module.exports = {
    name: "add",
    description: ADD.DESCRIPTION,
    extendedDescription: ADD.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, Strings.general.NOT_A_GROUP, MessageType.text);
            return;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.chatId, Strings.general.BOT_NOT_ADMIN, MessageType.text);
            return;
        }
        if (!args[0]) {
            client.sendMessage(BotsApp.chatId, ADD.NO_ARG_ERROR, MessageType.text);
            return;
        }
        try {
            let number;
            if (isNaN(args[0]) || args[0][0] === '+' || args[0].length < 10) {
                client.sendMessage(BotsApp.chatId, ADD.NUMBER_SYNTAX_ERROR, MessageType.text);
                return;
            }
            if (args[0].length == 10 && !isNaN(args[0])) {
                number = '91' + args[0];
            }
            else {
                number = args[0];
            }
            const exists = await client.isOnWhatsApp(number +'@s.whatsapp.net')
            if (!exists) {
                client.sendMessage(BotsApp.chatId, ADD.NOT_ON_WHATSAPP, MessageType.text);
                return;
            }
            const request = client.groupAdd(BotsApp.chatId, [BotsApp.owner, number+'@s.whatsapp.net']);
            const response = await request;
           
            if (response[number + '@c.us'] == 408) {
                client.sendMessage(BotsApp.chatId, ADD.NO_24HR_BAN, MessageType.text)
                console.log(response)
                return;
            } else if (response[number + '@c.us'] == 409) {
                client.sendMessage(BotsApp.chatId, ADD.ALREADY_MEMBER, MessageType.text);
                return;
            }
            client.sendMessage(BotsApp.chatId, (number + ADD.SUCCESS), MessageType.text)

        } catch (err) {
            console.log(err)
            if (err.status == 400) {
                client.sendMessage(BotsApp.chatId, ADD.NOT_ON_WHATSAPP, MessageType.text)
                return;
            }
            console.log(chalk.red("[ERROR] ", err));
        }
        return;
    }
}
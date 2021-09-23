const { MessageType } = require("@adiwajshing/baileys")
const chalk = require('chalk');

module.exports = {
    name: "add",
    description: "OOF",
    extendedDescription: "Not OOOf",
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, "*This is not a group. 😑*", MessageType.text);
            return;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.chatId, "*I am not group admin.*", MessageType.text);
            return;
        }
        if (!args[0]) {
            client.sendMessage(BotsApp.chatId, "*Enter the Number you want to add like '9712345678' .*", MessageType.text);
            return;
        }
        try { 
            let number;
            if (isNaN(args[0]) || args[0][0] === '+') {
                client.sendMessage(BotsApp.chatId, "*Enter a valid Number like '9712345678'.* For Non-Indian number, enter in international format without any spaces or special characters.\n```For example, 17842534789.```", MessageType.text);
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
                client.sendMessage(BotsApp.chatId, "*The number you're trying to add cannot be added for around 24 hours.*", MessageType.text)
                console.log(response)
                return;
            }else if(response[number + '@c.us'] == 409){
                client.sendMessage(BotsApp.chatId, "*The number you're trying to add is already present in the group.*", MessageType.text);
                return;
            }
            client.sendMessage(BotsApp.chatId, ("```" + number + " was added successfuly.!```"), MessageType.text)

        } catch (err) {
            console.log(err)
            if (err.status == 400) {
                client.sendMessage(BotsApp.chatId, "*The number you're trying to add is not available on WhatsApp. Please check the number again.*", MessageType.text)
                return;
            }
            console.log(chalk.red("[ERROR] ", err));
        }
        return;
    }
}
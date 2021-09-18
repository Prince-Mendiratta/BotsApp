const { MessageType } = require("@adiwajshing/baileys")
const chalk = require('chalk');

module.exports = {
    name: "add",
    description: "OOF",
    extendedDescription: "Not OOOf",
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.from, "*This is not a group. 😑*", MessageType.text);
            return;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.from, "*I am not group admin.*", MessageType.text);
            return;
        }
        if (!args[0]) {
            client.sendMessage(BotsApp.from, "*Enter the Number you want to add like '9712345678'.*", MessageType.text);
            return;
        }
        try {
            if (args[0].length != 0 || isNaN(args[0])) {
                client.sendMessage(BotsApp.from, "*Enter a valid Number like '9712345678'.*", MessageType.text);
                return;
            }
            else {
                const number = '91' + args[0]
                const request = client.groupAdd(BotsApp.from, [BotsApp.owner, number + '@s.whatsapp.net'])
                const response = await request;
                if(response[number + '@c.us'] != 200){
                    client.sendMessage(BotsApp.from, "*The number you're trying to add cannot be added for around 24 hours.*", MessageType.text)
                }
            }
        } catch (err) {
            if(err.status == 400){
                client.sendMessage(BotsApp.from, "*The number you're trying to add is not available on WhatsApp.*", MessageType.text)
            }
            console.log(chalk.red("[ERROR] ", err));
        }
        return 0;
    }
}
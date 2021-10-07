const {
    MessageType
} = require("@adiwajshing/baileys")
const translate = require('@vitalets/google-translate-api');
const STRINGS = require("../lib/db")
const format = require('python-format-js');

module.exports = {
    name: "translate",
    description: STRINGS.translate.DESCRIPTION,
    extendedDescription: STRINGS.translate.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        const proccessing = await client.sendMessage(BotsApp.chatId, STRINGS.translate.PROCESSING, MessageType.text);
        var text = '';
        var language = 'Hindi';
        for (var i = 0; i < args.length; i++) {
            if (args[i] == '|') {
                language = args[i + 1];
                break;
            }
            text += args[i] + " ";
        }
        if (text.length > 4000) {
            await client.sendMessage(BotsApp.chatId, STRINGS.translate.TOO_LONG.format(text.length), MessageType.text);
            return;
        }
        await translate(text, {
            to: language
        }).then(res => {
            console.log(res);
            client.sendMessage(BotsApp.chatId, res.text, MessageType.text);
        }).catch(err => {
            console.error(err);
            client.sendMessage(BotsApp.chatId, STRINGS.translate.LANGUAGE_NOT_SUPPORTED, MessageType.text);
        });
        return await client.deleteMessage(BotsApp.chatId, { id: proccessing.key.id, remoteJid: BotsApp.chatId, fromMe: true });
    }
}
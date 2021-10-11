const got = require('got');
const { MessageType } = require("@adiwajshing/baileys")
const STRINGS = require("../lib/db")
const ud = require('urban-dictionary')

module.exports = {
    name: "ud",
    description: STRINGS.ud.DESCRIPTION,
    extendedDescription: STRINGS.ud.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        var text = "";
        if (BotsApp.isReply) {
            text = BotsApp.replyMessage;;
        } else if (args.length == 0) {
            client.sendMessage(BotsApp.chatId, STRINGS.ud.NO_ARG, MessageType.text);
            return;
        } else {
            text = args.join(" ");
        }

        const proccessing = await client.sendMessage(BotsApp.chatId, STRINGS.ud.PROCESSING, MessageType.text);

        try {
            let Response = await ud.define(text);
            let result = Response.reduce(function (prev, current) {
                return (prev.thumbs_up + prev.thumbs_down > current.thumbs_up + current.thumbs_down) ? prev : current
            });

            result.definition = result.definition.replace(/\[/g, '_');
            result.definition = result.definition.replace(/\]/g, '_');
            result.example = result.example.replace(/\[/g, '_');
            result.example = result.example.replace(/\]/g, '_');

            let msg = "*Word :* " + result.word + "\n\n*Meaning :*\n" + result.definition + "\n\n*Example:*\n" + result.example + "\n〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️\n👍" + result.thumbs_up + "  👎" + result.thumbs_down;

            await client.deleteMessage(BotsApp.chatId, {
                id: proccessing.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true
            });

            await client.sendMessage(BotsApp.chatId, msg, MessageType.text);
        } catch (err) {
            console.log(err);
            client.sendMessage(BotsApp.chatId, STRINGS.ud.NOT_FOUND, MessageType.text);
            return await client.deleteMessage(BotsApp.chatId, {
                id: proccessing.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true
            });
        }
        return;
    }
}
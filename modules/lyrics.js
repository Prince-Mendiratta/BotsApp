const got = require('got');
const {
    MessageType,
    Mimetype
} = require("@adiwajshing/baileys")
const STRINGS = require("../lib/db")

module.exports = {
    name: "lyrics",
    description: STRINGS.DESCRIPTION,
    extendedDescription: STRINGS.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        var song = "";
        if (BotsApp.isReply) {
            song = BotsApp.replyMessage;;
        } else if (args.length == 0) {
            client.sendMessage(BotsApp.chatId, STRINGS.lyrics.NO_ARG, MessageType.text);
            return;
        } else {
            song = args.join(" ");
        }
        const proccessing = await client.sendMessage(BotsApp.chatId, STRINGS.lyrics.PROCESSING, MessageType.text);
        try {
            let Response = await got(`https://some-random-api.ml/lyrics/?title=${song}`);
            let data = JSON.parse(Response.body)
            console.log(data);
            let caption = "*Title :* " + data.title + "\n*Author :* " + data.author + "\n*Lyrics :*\n" + data.lyrics;
            await client.deleteMessage(BotsApp.chatId, {
                id: proccessing.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true
            });
            await client.sendMessage(
                BotsApp.chatId, { url: data.thumbnail.genius },
                MessageType.image,
                { mimetype: Mimetype.image, caption: caption }
            );
        } catch (err) {
            console.log(err);
            client.sendMessage(BotsApp.chatId, STRINGS.lyrics.NOT_FOUND, MessageType.text);
            return await client.deleteMessage(BotsApp.chatId, {
                id: proccessing.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true
            });
        }
        return;
    }
}
const got = require('got');
const {
    MessageType,
    Mimetype
} = require("@adiwajshing/baileys")
const STRINGS = require("../lib/db")

module.exports = {
    name: "lyrics",
    description: STRINGS.lyrics.DESCRIPTION,
    extendedDescription: STRINGS.lyrics.EXTENDED_DESCRIPTION,
    demo: {isEnabled: true, text: '.lyrics love nwantiti'},
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
        const processing = await client.sendMessage(BotsApp.chatId, STRINGS.lyrics.PROCESSING, MessageType.text);
        try {
            let Response = await got(`https://some-random-api.ml/lyrics/?title=${song}`);
            let data = JSON.parse(Response.body)
            console.log(data);
            let caption = "*Title :* " + data.title + "\n*Author :* " + data.author + "\n*Lyrics :*\n" + data.lyrics;
            
            try{
            await client.sendMessage(
                BotsApp.chatId, { url: data.thumbnail.genius },
                MessageType.image,
                { mimetype: Mimetype.png, caption: caption, thumbnail: null }
            );
            }
            catch(err){
                console.log("ERROR" + err)
                client.sendMessage(BotsApp.chatId, caption, MessageType.text);
            }
            
        } catch (err) {
            console.log(err);
            client.sendMessage(BotsApp.chatId, STRINGS.lyrics.NOT_FOUND, MessageType.text);
            return await client.deleteMessage(BotsApp.chatId, {
                id: processing.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true
            });
        }
        await client.deleteMessage(BotsApp.chatId, {
            id: processing.key.id,
            remoteJid: BotsApp.chatId,
            fromMe: true
        });        return;
    }
}
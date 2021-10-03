const { MessageType, Mimetype } = require("@adiwajshing/baileys")
const googleTTS = require('google-tts-api');
const STRINGS = require("../lib/db.js");

module.exports = {
    name: "tts",
    description: STRINGS.tts.DESCRIPTION,
    extendedDescription: STRINGS.tts.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        let text = '';
        let langCode = "en";
        for (var i = 0; i < args.length; i++) {
            if (args[i] == '|') {
                langCode = args[i + 1];
                break;
            }
            text += args[i] + " ";
        }
        const url = googleTTS.getAudioUrl(text, {
            lang: langCode,
            slow: false,
            host: 'https://translate.google.com',
        });
        console.log(url);
        try {
            await client.sendMessage(BotsApp.chatId, { url: url }, MessageType.audio, { mimetype: Mimetype.mp4Audio });
        }
        catch (err) {
            console.log(err);
        }
        return;
    }
}


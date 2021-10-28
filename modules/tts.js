const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const format = require("python-format-js");
const inputSanitization = require("../sidekick/input-sanitization");
const googleTTS = require("google-tts-api");
const STRINGS = require("../lib/db.js");

module.exports = {
    name: "tts",
    description: STRINGS.tts.DESCRIPTION,
    extendedDescription: STRINGS.tts.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [".tts やめてください", ".tts やめてください | ja"],
    },
    async handle(client, chat, BotsApp, args) {
        const proccessing = await client.sendMessage(
            BotsApp.chatId,
            STRINGS.tts.PROCESSING,
            MessageType.text
        ).catch(err => inputSanitization.handleError(err, client, BotsApp));
        try {
            let text = "";
            let langCode = "en";
            if (!BotsApp.isReply) {
                try {
                    var body = BotsApp.body.split("|");
                    text = body[0].replace(
                        BotsApp.body[0] + BotsApp.commandName + " ",
                        ""
                    );
                    var i = 0;
                    var lang = body[1].split(" ");
                    while (lang[i].length == 0) {
                        i++;
                    }
                    langCode = lang[i];
                } catch (err) {
                    if (err instanceof TypeError) {
                        text = BotsApp.body.replace(
                            BotsApp.body[0] + BotsApp.commandName + " ",
                            ""
                        );
                        langCode = "English";
                    }
                    console.log(err);
                }
            } else if (BotsApp.replyMessage) {
                if (args.length == 0) {
                    langCode = "en";
                } else {
                    langCode = args[0];
                }
                text = BotsApp.replyMessage;
            } else {
                await client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.tts.INVALID_REPLY,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return await client.deleteMessage(BotsApp.chatId, {
                    id: proccessing.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
            }
            if (text.length > 200) {
                await client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.tts.TOO_LONG.format(text.length),
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            } else {
                try {
                    const url = googleTTS.getAudioUrl(text, {
                        lang: langCode,
                        slow: false,
                        host: "https://translate.google.com",
                    });
                    await client.sendMessage(
                        BotsApp.chatId,
                        { url: url },
                        MessageType.audio,
                        { mimetype: Mimetype.mp4Audio }
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                } catch (err) {
                    await inputSanitization.handleError(
                        err,
                        client,
                        BotsApp,
                        STRINGS.tts.INVALID_LANG_CODE
                    );
                }
            }
            return await client.deleteMessage(BotsApp.chatId, {
                id: proccessing.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true,
            });
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

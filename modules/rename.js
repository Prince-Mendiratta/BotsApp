const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const inputSanitization = require("../sidekick/input-sanitization");
const { JSDOM } = require("jsdom");
const { window } = new JSDOM();
const Strings = require("../lib/db");
const rename = Strings.rename;

module.exports = {
    name: "rename",
    description: rename.DESCRIPTION,
    extendedDescription: rename.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client, chat, BotsApp, args) {
        // Task starts here
        try {
            var startTime = window.performance.now();

            // Function to convert media to sticker
            const changeName = async (replyChat, mimetype, ext) => {
                var downloading = await client
                    .sendMessage(
                        BotsApp.chatId,
                        rename.DOWNLOADING,
                        MessageType.text
                    )
                    .catch((err) =>
                        inputSanitization.handleError(err, client, BotsApp)
                    );

                const fileName = "./tmp/" + args[0];
                const filePath = await client
                    .downloadAndSaveMediaMessage(replyChat, fileName)
                    .catch((err) =>
                        inputSanitization.handleError(err, client, BotsApp)
                    );
                client
                    .sendMessage(
                        BotsApp.chatId,
                        fs.readFileSync(filePath),
                        MessageType.document,
                        {
                            mimetype: mimetype,
                            thumbnail: null,
                            filename: args[0] + ext,
                        }
                    )
                    .catch((err) =>
                        inputSanitization.handleError(err, client, BotsApp)
                    );
                inputSanitization.deleteFiles(filePath);
                inputSanitization.performanceTime(startTime);
                return client
                    .deleteMessage(BotsApp.chatId, {
                        id: downloading.key.id,
                        remoteJid: BotsApp.chatId,
                        fromMe: true,
                    })
                    .catch((err) =>
                        inputSanitization.handleError(err, client, BotsApp)
                    );
            };
            if (BotsApp.isReply) {
                if (args.length < 1) {
                    return client.sendMessage(
                        BotsApp.chatId,
                        rename.PROVIDE_NEW_NAME,
                        MessageType.text
                    );
                }
                let replyChat = {
                    message:
                        chat.message.extendedTextMessage.contextInfo
                            .quotedMessage,
                };
                let mimetype = replyChat.message.documentMessage.mimetype;
                let ext = replyChat.message.documentMessage.title.substring(
                    replyChat.message.documentMessage.title.indexOf("."),
                    replyChat.message.documentMessage.title.length
                );
                changeName(replyChat, mimetype, ext);
            }
            else{
                return client.sendMessage(BotsApp.chatId , rename.REPLY_TO_DOCUMENT , MessageType.text);
            }
        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                BotsApp,
                rename.ERROR
            );
        }
    },
};

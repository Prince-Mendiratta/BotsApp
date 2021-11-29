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
            const changeName = async (replyChat,mediaType, mimetype) => {
                mediaType = mediaType.substring(0, mediaType.indexOf("Message"));
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
                        MessageType[mediaType],
                        {
                            mimetype: mimetype,
                            thumbnail: null,
                            filename: args[0],
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
                let mediaType = Object.keys(replyChat.message)[0];
                console.log(mediaType);
                let mimetype = replyChat.message[mediaType].mimetype;
                console.log(mimetype);
                changeName(replyChat,mediaType, mimetype);
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

const { MessageType } = require("@adiwajshing/baileys");
const ocrSpace = require("ocr-space-api-wrapper");
const STRINGS = require("../lib/db.js");
const OCR = STRINGS.ocr;
const config = require("../config");
const inputSanitization = require("../sidekick/input-sanitization");

module.exports = {
    name: "ocr",
    description: OCR.DESCRIPTION,
    extendedDescription: OCR.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        try {
            const processing = await client.sendMessage(
                BotsApp.chatId,
                OCR.PROCESSING,
                MessageType.text
            );
            if (BotsApp.isImage) {
                var replyChatObject = {
                    message: chat.message,
                };
                var imageId = chat.key.id;
                const fileName = "./tmp/img-" + imageId;
                const filePath = await client.downloadAndSaveMediaMessage(
                    replyChatObject,
                    fileName
                );
                try {
                    const text = await ocrSpace(filePath, {
                        apiKey: config.OCR_API_KEY,
                    });
                    var Msg = text.ParsedResults[0].ParsedText;
                    if (Msg === "") {
                        client.sendMessage(
                            BotsApp.chatId,
                            OCR.NO_TEXT,
                            MessageType.text
                        );
                        return await client.deleteMessage(BotsApp.chatId, {
                            id: processing.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        });
                    }
                    client.sendMessage(BotsApp.chatId, Msg, MessageType.text);
                } catch (error) {
                    throw error;
                }
                inputSanitization.deleteFiles(filePath);
                return await client.deleteMessage(BotsApp.chatId, {
                    id: processing.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
            }
            if (BotsApp.isReplyImage) {
                var replyChatObject = {
                    message:
                        chat.message.extendedTextMessage.contextInfo
                            .quotedMessage,
                };
                var imageId =
                    chat.message.extendedTextMessage.contextInfo.stanzaId;
                const fileName = "./tmp/img-" + imageId;
                const filePath = await client.downloadAndSaveMediaMessage(
                    replyChatObject,
                    fileName
                );
                try {
                    const text = await ocrSpace(filePath, {
                        apiKey: config.OCR_API_KEY,
                    });
                    var Msg = text.ParsedResults[0].ParsedText;
                    if (Msg === "") {
                        client.sendMessage(
                            BotsApp.chatId,
                            OCR.NO_TEXT,
                            MessageType.text
                        );
                        return await client.deleteMessage(BotsApp.chatId, {
                            id: processing.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        });
                    }
                    client.sendMessage(BotsApp.chatId, Msg, MessageType.text);
                } catch (error) {
                    throw error;
                }
                inputSanitization.deleteFiles(filePath);
                return await client.deleteMessage(BotsApp.chatId, {
                    id: processing.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
            }
            setTimeout(async () => {
                await client.sendMessage(
                    BotsApp.chatId,
                    OCR.ERROR_MSG,
                    MessageType.text
                );
                return;
            }, 300000);
            await client.sendMessage(
                BotsApp.chatId,
                OCR.ERROR_MSG,
                MessageType.text
            );
            return await client.deleteMessage(BotsApp.chatId, {
                id: processing.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true,
            });
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

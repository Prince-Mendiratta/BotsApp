const { MessageType } = require("@adiwajshing/baileys")
const ocrSpace = require('ocr-space-api-wrapper')
const STRINGS=require("../lib/db.js")
const fs = require('fs');
const config = require('../config')

module.exports = {
    name: "ocr",
    description: STRINGS.ocr.DESCRIPTION,
    extendedDescription:STRINGS.ocr.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        const proccessing = await client.sendMessage(BotsApp.chatId, STRINGS.ocr.PROCESSING, MessageType.text);
        if (BotsApp.isImage) {
            var replyChatObject = {
                message: chat.message,
            };
            var imageId = chat.key.id;
            console.log("repliedImageMessageId --> " + imageId);
            const fileName = "./tmp/img-" + imageId;
            const filePath = await client.downloadAndSaveMediaMessage(
                replyChatObject,
                fileName
            );
            try {
                const text = await ocrSpace(filePath, { apiKey: config.OCR_API_KEY })
                console.log(text);
                client.sendMessage(BotsApp.chatId, text.ParsedResults[0].ParsedText, MessageType.text);
            } catch (error) {
                console.log(error)
            }
            fs.unlinkSync(filePath);
            return await client.deleteMessage(BotsApp.chatId, { id: proccessing.key.id, remoteJid: BotsApp.chatId, fromMe: true });

        }
        if (BotsApp.isReplyImage) {
            var replyChatObject = {
                message:
                    chat.message.extendedTextMessage.contextInfo.quotedMessage,
            };
            var imageId = chat.message.extendedTextMessage.contextInfo.stanzaId;
            console.log("repliedImageMessageId --> " + imageId);
            const fileName = "./tmp/img-" + imageId;
            const filePath = await client.downloadAndSaveMediaMessage(
                replyChatObject,
                fileName
            );
            try {
                const text = await ocrSpace(filePath, { apiKey: config.OCR_API_KEY })
                console.log(text);
                client.sendMessage(BotsApp.chatId, text.ParsedResults[0].ParsedText, MessageType.text);
            } catch (error) {
                console.log(error);
            }
            fs.unlinkSync(filePath);
            return await client.deleteMessage(BotsApp.chatId, { id: proccessing.key.id, remoteJid: BotsApp.chatId, fromMe: true });
        }
        await client.sendMessage(BotsApp.chatId, STRINGS.ocr.ERROR_MSG, MessageType.text);
        return await client.deleteMessage(BotsApp.chatId, { id: proccessing.key.id, remoteJid: BotsApp.chatId, fromMe: true });
    }
}
import ocrSpace from "ocr-space-api-wrapper";
import STRINGS from "../lib/db.js";
import config from "../config";
import inputSanitization from "../sidekick/input-sanitization";
import Client from "../sidekick/client";
import { downloadContentFromMessage, proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
import { Transform } from "stream";
const OCR = STRINGS.ocr;

module.exports = {
    name: "ocr",
    description: OCR.DESCRIPTION,
    extendedDescription: OCR.EXTENDED_DESCRIPTION,
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void>{
        try {
            
            if (BotsApp.isImage) {
                const processing = await client.sendMessage(
                    BotsApp.chatId,
                    OCR.PROCESSING,
                    MessageType.text
                );
                var replyChatObject = {
                    message: chat.message.imageMessage,
                };
                var imageId = chat.key.id;
                const fileName = "./tmp/img-" + imageId + '.png';
                const stream: Transform = await downloadContentFromMessage(replyChatObject.message, 'image');
                await inputSanitization.saveBuffer(fileName, stream);
                try {
                    const text = await ocrSpace(fileName, {
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
                    await client.sendMessage(BotsApp.chatId, Msg, MessageType.text);
                } catch (error) {
                    throw error;
                }
                inputSanitization.deleteFiles(fileName);
                return await client.deleteMessage(BotsApp.chatId, {
                    id: processing.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
            }else if (BotsApp.isReplyImage) {
                const processing = await client.sendMessage(
                    BotsApp.chatId,
                    OCR.PROCESSING,
                    MessageType.text
                );
                var replyChatObject = {
                    message:
                        chat.message.extendedTextMessage.contextInfo
                            .quotedMessage.imageMessage,
                };
                var imageId =
                    chat.message.extendedTextMessage.contextInfo.stanzaId;
                const fileName = "./tmp/img-" + imageId + '.png';
                const stream: Transform = await downloadContentFromMessage(replyChatObject.message, 'image');
                await inputSanitization.saveBuffer(fileName, stream);
                try {
                    const text = await ocrSpace(fileName, {
                        apiKey: config.OCR_API_KEY,
                    });
                    console.log(text);
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
                    await client.sendMessage(BotsApp.chatId, Msg, MessageType.text);
                } catch (error) {
                    throw error;
                }
                inputSanitization.deleteFiles(fileName);
                return client.deleteMessage(BotsApp.chatId, {
                    id: processing.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
            }else{
                await client.sendMessage(
                    BotsApp.chatId,
                    OCR.ERROR_MSG,
                    MessageType.text
                );
            }
            setTimeout(async () => {
                await client.sendMessage(
                    BotsApp.chatId,
                    OCR.ERROR_MSG,
                    MessageType.text
                );
                return;
            }, 300000);
            return;
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

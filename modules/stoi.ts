import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import inputSanitization from "../sidekick/input-sanitization";
import Strings from "../lib/db";
import Client from "../sidekick/client";
import { downloadContentFromMessage, proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
import { Transform } from "stream";
const STOI = Strings.stoi;

module.exports = {
    name: "stoi",
    description: STOI.DESCRIPTION,
    extendedDescription: STOI.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        // Task starts here
        try {
            // Function to convert media to sticker
            const convertToImage = async (stickerId: string, replyChat: { message: proto.Message.IStickerMessage; type: any; }) => {
                var downloading = await client.sendMessage(
                    BotsApp.chatId,
                    STOI.DOWNLOADING,
                    MessageType.text
                );

                const fileName = "./tmp/convert_to_image-" + stickerId;
                const stream: Transform = await downloadContentFromMessage(replyChat.message, replyChat.type);
                await inputSanitization.saveBuffer(fileName, stream);
                const imagePath = "./tmp/image-" + stickerId + ".png";
                try {
                    ffmpeg(fileName)
                        .save(imagePath)
                        .on("error", function (err, stdout, stderr) {
                            inputSanitization.deleteFiles(fileName);
                            client.deleteMessage(BotsApp.chatId, {
                                id: downloading.key.id,
                                remoteJid: BotsApp.chatId,
                                fromMe: true,
                            });
                            throw err;
                        })
                        .on("end", async () => {
                            await client.sendMessage(
                                BotsApp.chatId,
                                fs.readFileSync(imagePath),
                                MessageType.image,
                            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                            await inputSanitization.deleteFiles(fileName, imagePath);
                            return await client.deleteMessage(BotsApp.chatId, {
                                id: downloading.key.id,
                                remoteJid: BotsApp.chatId,
                                fromMe: true,
                            }).catch(err => inputSanitization.handleError(err, client, BotsApp));
                        });
                } catch (err) {
                    throw err;
                }
            };

            if (BotsApp.isReplySticker && !BotsApp.isReplyAnimatedSticker) {
                var replyChatObject = {
                    message:
                        chat.message.extendedTextMessage.contextInfo
                            .quotedMessage.stickerMessage,
                    type: 'sticker'
                };
                var stickerId =
                    chat.message.extendedTextMessage.contextInfo.stanzaId;
                convertToImage(stickerId, replyChatObject);
            } else if (BotsApp.isReplyAnimatedSticker) {
                client.sendMessage(
                    BotsApp.chatId,
                    STOI.TAG_A_VALID_STICKER_MESSAGE,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            } else {
                client.sendMessage(
                    BotsApp.chatId,
                    STOI.TAG_A_VALID_STICKER_MESSAGE,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            }
            return;
        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                BotsApp,
                STOI.ERROR
            );
        }
    },
};

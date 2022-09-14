import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import inputSanitization from "../sidekick/input-sanitization";
import { MessageType } from "../sidekick/message-type";
import Strings from "../lib/db";
import Client from "../sidekick/client";
import { downloadContentFromMessage, proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import { Transform } from "stream";

const STICKER = Strings.sticker;

export = {
    name: "sticker",
    description: STICKER.DESCRIPTION,
    extendedDescription: STICKER.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        // Task starts here
        try {
            // Function to convert media to sticker
            const convertToSticker = async (imageId: string, replyChat: { message: any; type: any; }): Promise<void> => {
                var downloading: proto.WebMessageInfo = await client.sendMessage(
                    BotsApp.chatId,
                    STICKER.DOWNLOADING,
                    MessageType.text
                );
                const fileName: string = "./tmp/convert_to_sticker-" + imageId;
                const stream: Transform = await downloadContentFromMessage(replyChat.message, replyChat.type);
                await inputSanitization.saveBuffer(fileName, stream);
                const stickerPath: string = "./tmp/st-" + imageId + ".webp";
                // If is an image
                if (BotsApp.type === "image" || BotsApp.isReplyImage) {
                    ffmpeg(fileName)
                        .outputOptions(["-y", "-vcodec libwebp"])
                        .videoFilters(
                            "scale=2000:2000:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=2000:2000:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1"
                        )
                        .save(stickerPath)
                        .on("end", async () => {
                            await client.sendMessage(
                                BotsApp.chatId,
                                fs.readFileSync(stickerPath),
                                MessageType.sticker
                            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                            await inputSanitization.deleteFiles(
                                fileName,
                                stickerPath
                            );
                            await client.deleteMessage(BotsApp.chatId, {
                                id: downloading.key.id,
                                remoteJid: BotsApp.chatId,
                                fromMe: true,
                            }).catch(err => inputSanitization.handleError(err, client, BotsApp));
                        })
                        .on('error', async (err: any) => {
                            inputSanitization.handleError(err, client, BotsApp)
                            await client.deleteMessage(BotsApp.chatId, {
                                id: downloading.key.id,
                                remoteJid: BotsApp.chatId,
                                fromMe: true,
                            }).catch(err => inputSanitization.handleError(err, client, BotsApp));
                        });
                    return;
                }
                // If is a video
                ffmpeg(fileName)
                    .duration(8)
                    .outputOptions([
                        "-y",
                        "-vcodec libwebp",
                        "-lossless 1",
                        "-qscale 1",
                        "-preset default",
                        "-loop 0",
                        "-an",
                        "-vsync 0",
                        "-s 600x600",
                    ])
                    .videoFilters(
                        "scale=600:600:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=600:600:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1"
                    )
                    .save(stickerPath)
                    .on("end", async (err: any) => {
                        await client.sendMessage(
                            BotsApp.chatId,
                            fs.readFileSync(stickerPath),
                            MessageType.sticker
                        ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                        await inputSanitization.deleteFiles(fileName, stickerPath);
                        await client.deleteMessage(BotsApp.chatId, {
                            id: downloading.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        }).catch(err => inputSanitization.handleError(err, client, BotsApp));
                    })
                    .on('error', async (err: any) => {
                        inputSanitization.handleError(err, client, BotsApp)
                        await client.deleteMessage(BotsApp.chatId, {
                            id: downloading.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        }).catch(err => inputSanitization.handleError(err, client, BotsApp));
                    });
                return;
            };

            // User sends media message along with command in caption
            if (BotsApp.isImage || BotsApp.isGIF || BotsApp.isVideo) {
                var replyChatObject = {
                    message: (BotsApp.type === 'image' ? chat.message.imageMessage : chat.message.videoMessage),
                    type: BotsApp.type
                };
                var imageId: string = chat.key.id;
                convertToSticker(imageId, replyChatObject);
            }
            // Replied to an image , gif or video
            else if (
                BotsApp.isReplyImage ||
                BotsApp.isReplyGIF ||
                BotsApp.isReplyVideo
            ) {
                var replyChatObject = {
                    message: (BotsApp.isReplyImage ? chat.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : chat.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage),
                    type: (BotsApp.isReplyImage ? 'image' : 'video')
                };
                var imageId: string =
                    chat.message.extendedTextMessage.contextInfo.stanzaId;
                convertToSticker(imageId, replyChatObject);
            } else {
                client.sendMessage(
                    BotsApp.chatId,
                    STICKER.TAG_A_VALID_MEDIA_MESSAGE,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            }
            return;
        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                BotsApp,
                STICKER.TAG_A_VALID_MEDIA_MESSAGE
            );
        }
    },
};

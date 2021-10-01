const { MessageType, MimetypeMap } = require("@adiwajshing/baileys");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const inputSanitization = require("../../../BotsApp - Copy/sidekick/input-sanitization")

const Strings = require("../../../BotsApp - Copy/lib/db");
const STICKER = Strings.sticker;

module.exports = {
    name: "sticker",
    description: STICKER.DESCRIPTION,
    extendedDescription: STICKER.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if (
            BotsApp.isReplyImage ||
            BotsApp.isReplyGIF ||
            BotsApp.isReplyVideo
        ) {
            var downloading = await client.sendMessage(
                BotsApp.chatId,
                STICKER.DOWNLOADING,
                MessageType.text
            );
            
            var imageId = chat.message.extendedTextMessage.contextInfo.stanzaId;
            console.log("repliedImageMessageId --> " + imageId);
            var replyChat = {
                message:
                    chat.message.extendedTextMessage.contextInfo.quotedMessage,
            };
            const fileName = "./tmp/convert_to_sticker-" + imageId;
            const filePath = await client.downloadAndSaveMediaMessage(
                replyChat,
                fileName
            );
            const stickerPath = "./tmp/st-" + imageId + ".webp";
            if (BotsApp.isReplyVideo === false && BotsApp.isReplyImage) {
                await ffmpeg(filePath)
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
                        );
                        inputSanitization.deleteFiles(filePath , stickerPath);
                        return await client.deleteMessage(BotsApp.chatId, {
                            id: downloading.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        });
                    });
            } else {
                await ffmpeg(filePath)
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
                    .on("end", async () => {
                        await client.sendMessage(
                            BotsApp.chatId,
                            fs.readFileSync(stickerPath),
                            MessageType.sticker
                        );
                        inputSanitization.deleteFiles(filePath , stickerPath);
                        return await client.deleteMessage(BotsApp.chatId, {
                            id: downloading.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        });
                    });
            }

            
            // fs.unlink(filePath, (err) => {
            //     if (err) console.log(err);
            //     else {
            //         console.log("\nDeleted file at: " + filePath);
            //     }
            // });
            // fs.unlink(stickerPath, (err) => {
            //     if (err) console.log(err);
            //     else {
            //         console.log("\nDeleted file at: " + stickerPath);
            //     }
            // });
            
            
        } else {
            client.sendMessage(
                BotsApp.chatId,
                STICKER.TAG_A_VALID_IMAGE_MESSAGE,
                MessageType.text
            );
            return;
        }
    },
};

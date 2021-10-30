const { MessageType, MimetypeMap } = require("@adiwajshing/baileys");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const inputSanitization = require("../sidekick/input-sanitization");
const { JSDOM } = require("jsdom");
const { window } = new JSDOM();

const Strings = require("../lib/db");
const STICKER = Strings.sticker;

module.exports = {
    name: "sticker",
    description: STICKER.DESCRIPTION,
    extendedDescription: STICKER.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client, chat, BotsApp, args) {
        // Task starts here
        var startTime = window.performance.now();
        try {
            // Function to convert media to sticker
            const convertToSticker = async (imageId, replyChat) => {
                var downloading = await client.sendMessage(
                    BotsApp.chatId,
                    STICKER.DOWNLOADING,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));

                const fileName = "./tmp/convert_to_sticker-" + imageId;
                const filePath = await client.downloadAndSaveMediaMessage(
                    replyChat,
                    fileName
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                const stickerPath = "./tmp/st-" + imageId + ".webp";
                if (BotsApp.type === "image" || BotsApp.isReplyImage) {
                    ffmpeg(filePath)
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
                            inputSanitization.deleteFiles(
                                filePath,
                                stickerPath
                            );
                            inputSanitization.performanceTime(startTime);
                            await client.deleteMessage(BotsApp.chatId, {
                                id: downloading.key.id,
                                remoteJid: BotsApp.chatId,
                                fromMe: true,
                            }).catch(err => inputSanitization.handleError(err, client, BotsApp));
                        })
                        .on('error', async() => {
                            inputSanitization.handleError(err, client, BotsApp)
                            await client.deleteMessage(BotsApp.chatId, {
                                id: downloading.key.id,
                                remoteJid: BotsApp.chatId,
                                fromMe: true,
                            }).catch(err => inputSanitization.handleError(err, client, BotsApp));
                        });
                    return;
                }
                ffmpeg(filePath)
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
                    .on("end", async (err) => {
                        await client.sendMessage(
                            BotsApp.chatId,
                            fs.readFileSync(stickerPath),
                            MessageType.sticker
                        ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                        inputSanitization.deleteFiles(filePath, stickerPath);
                        inputSanitization.performanceTime(startTime);
                        await client.deleteMessage(BotsApp.chatId, {
                            id: downloading.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        }).catch(err => inputSanitization.handleError(err, client, BotsApp));
                    })
                    .on('error', async(err) => {
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
                    message: chat.message,
                };
                var imageId = chat.key.id;
                convertToSticker(imageId, replyChatObject);
            }
            // Replied to an image , gif or video
            else if (
                BotsApp.isReplyImage ||
                BotsApp.isReplyGIF ||
                BotsApp.isReplyVideo
            ) {
                var replyChatObject = {
                    message:
                        chat.message.extendedTextMessage.contextInfo
                            .quotedMessage,
                };
                var imageId =
                    chat.message.extendedTextMessage.contextInfo.stanzaId;
                convertToSticker(imageId, replyChatObject);
            } else {
                client.sendMessage(
                    BotsApp.chatId,
                    STICKER.TAG_A_VALID_MEDIA_MESSAGE,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                inputSanitization.performanceTime(startTime);
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

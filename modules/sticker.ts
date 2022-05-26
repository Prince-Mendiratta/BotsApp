export
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const inputSanitization = require("../sidekick/input-sanitization");
const Strings = require("../lib/db");
const STICKER = Strings.sticker;
const TRANSMIT = require('../core/transmission')
import { downloadContentFromMessage } from '@adiwajshing/baileys'
const {writeFile} = require('fs').promises
import {Buffer} from 'buffer'

module.exports = {
    name: "sticker",
    description: STICKER.DESCRIPTION,
    extendedDescription: STICKER.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client, chat, BotsApp, args) {
        // Task starts here
        try {
            // Function to convert media to sticker
            const convertToSticker = async (filename) => {
                await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STICKER.DOWNLOADING})
                let rand = (Math.random() + 1).toString(7).substring(7);
                const stickerPath = "st-" + rand + ".webp";

                if (BotsApp.type === "image" || BotsApp.isReplyImage) {
                    ffmpeg(filename)
                        .outputOptions(["-y", "-vcodec libwebp"])
                        .videoFilters(
                            "scale=2000:2000:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=2000:2000:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1"
                        )
                        .save(stickerPath)
                        .on("end", async () => {
                            await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {sticker:{url:stickerPath}}).catch(err => inputSanitization.handleError(err, client, BotsApp))
                            await inputSanitization.deleteFiles(
                                filename,
                                stickerPath
                            );
                        })
                        .on('error', async(error) => {
                            await inputSanitization.handleError(error, client, BotsApp)
                        });
                    return;
                }
                ffmpeg(filename)
                    .duration(5)
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
                        await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {sticker:{url:stickerPath}}).catch(err => inputSanitization.handleError(err, client, BotsApp))
                            .catch(err => inputSanitization.handleError(err, client, BotsApp));
                        await inputSanitization.deleteFiles(filename, stickerPath);
                    })
                    .on('error', async(err) => {
                        await inputSanitization.handleError(err, client, BotsApp)
                    });
                return;
            };

            let fileName
            // User sends media message along with command in caption
            if (BotsApp.isImage) {
                fileName = "img-" + chat.key.id;
                const download_object = {
                    mediaKey: chat.message.imageMessage.mediaKey,
                    directPath: chat.message.imageMessage.directPath,
                    url: chat.message.imageMessage.url
                }
                const stream = await downloadContentFromMessage(download_object, 'image')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                await writeFile(fileName, buffer)
                await convertToSticker(fileName)

            } else if (BotsApp.isGIF || BotsApp.isVideo){

                fileName = "vid-" + chat.key.id;
                const download_object = {
                    mediaKey: chat.message.videoMessage.mediaKey,
                    directPath: chat.message.videoMessage.directPath,
                    url: chat.message.videoMessage.url
                }
                const stream = await downloadContentFromMessage(download_object, 'video')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                await writeFile(fileName, buffer)
                await convertToSticker(fileName)

            } else if (BotsApp.isReplyImage) {
                const imageId = chat.message.extendedTextMessage.contextInfo.stanzaId;
                fileName = "img-" + imageId;

                const download_object = {
                    mediaKey: chat.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage.mediaKey,
                    directPath: chat.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage.directPath,
                    url: chat.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage.url
                }
                const stream = await downloadContentFromMessage(download_object, 'image')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                await writeFile(fileName, buffer)
                await convertToSticker(fileName)

            }  else if(BotsApp.isReplyGIF || BotsApp.isReplyVideo){
                const imageId = chat.message.extendedTextMessage.contextInfo.stanzaId;
                fileName = "vid-" + imageId;

                const download_object = {
                    mediaKey: chat.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.mediaKey,
                    directPath: chat.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.directPath,
                    url: chat.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.url
                }
                const stream = await downloadContentFromMessage(download_object, 'video')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                await writeFile(fileName, buffer)
                await convertToSticker(fileName)

            } else return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STICKER.TAG_A_VALID_MEDIA_MESSAGE})

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

export
const {ocrSpace} = require("ocr-space-api-wrapper");
const STRINGS = require("../lib/db");
const OCR = STRINGS.ocr;
const config = require("../config");
const inputSanitization = require("../sidekick/input-sanitization");
const TRANSMIT = require("../core/transmission")
import { downloadContentFromMessage } from '@adiwajshing/baileys'
const {writeFile} = require('fs').promises
import {Buffer} from 'buffer'

module.exports = {
    name: "ocr",
    description: OCR.DESCRIPTION,
    extendedDescription: OCR.EXTENDED_DESCRIPTION,
    demo: {isEnabled: false},
    async handle(client, chat, BotsApp, args) {
        try {
            await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: OCR.PROCESSING})

            let fileName

            console.log(chat.message)
            if (BotsApp.isImage) {
                 fileName = "img-" + chat.key.id + ".jpeg";
                const download_object = {
                    mediaKey:chat.message.imageMessage.mediaKey,
                    directPath:chat.message.imageMessage.directPath,
                    url:chat.message.imageMessage.url
                }
                const stream = await downloadContentFromMessage(download_object, 'image')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                await writeFile(fileName, buffer)

                try {
                    const text = await ocrSpace(fileName, {
                        apiKey: config.OCR_API_KEY,
                    });

                    const Msg = text.ParsedResults[0].ParsedText;
                    if (Msg === "") {
                         await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: OCR.NO_TEXT})
                         return await inputSanitization.deleteFiles(fileName);

                    }
                     await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: Msg})
                    return await inputSanitization.deleteFiles(fileName);

                } catch (error) {
                    throw error;
                }
            }
            if (BotsApp.isReplyImage) {
                const imageId = chat.message.extendedTextMessage.contextInfo.stanzaId;
                fileName = "img-" + imageId + ".jpeg";

                const download_object = {
                    mediaKey:chat.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage.mediaKey,
                    directPath:chat.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage.directPath,
                    url:chat.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage.url
                }
                const stream = await downloadContentFromMessage(download_object, 'image')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                await writeFile(fileName, buffer)

                try {
                    const text = await ocrSpace(fileName, {
                        apiKey: config.OCR_API_KEY,
                    });
                    const Msg = text.ParsedResults[0].ParsedText;
                    if (Msg === "") {
                        await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: OCR.NO_TEXT})
                        return await inputSanitization.deleteFiles(fileName);
                    }
                    await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: Msg})
                    return await inputSanitization.deleteFiles(fileName);
                } catch (error) {
                    throw error;
                }
            }
            setTimeout(async () => {
              return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: OCR.ERROR_MSG})

            }, 300000);
            await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: OCR.ERROR_MSG})

        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

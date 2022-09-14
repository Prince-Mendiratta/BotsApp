import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import inputSanitization from "../sidekick/input-sanitization";
import Strings from "../lib/db";
import Client from "../sidekick/client";
import { downloadContentFromMessage, proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
import { Transform } from "stream";
import FormData from 'form-data';
import Axios from "axios";
import cheerio from "cheerio";
const STOV = Strings.stov;

module.exports = {
    name: "stov",
    description: STOV.DESCRIPTION,
    extendedDescription: STOV.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        // Task starts here
        try {
            // Function to convert media to sticker
            const convertToVideo = async (stickerId: string, replyChat: { message: proto.Message.IStickerMessage; type: any; }) => {
                var downloading = await client.sendMessage(
                    BotsApp.chatId,
                    STOV.DOWNLOADING,
                    MessageType.text
                );

                const fileName = "./tmp/convert_to_video-" + stickerId;
                const stream: Transform = await downloadContentFromMessage(replyChat.message, replyChat.type);
                await inputSanitization.saveBuffer(fileName, stream);
                const videoPath = "./tmp/video-" + stickerId + ".mp4";
                try {
                    let res = await webp2mp4File(fileName, videoPath);
                    await client.sendMessage(
                        BotsApp.chatId,
                        {url: res},
                        MessageType.video,
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                } catch (err) {
                    throw err;
                }
            };

            if (BotsApp.isReplySticker) {
                var replyChatObject = {
                    message:
                        chat.message.extendedTextMessage.contextInfo
                            .quotedMessage.stickerMessage,
                    type: 'sticker'
                };
                var stickerId =
                    chat.message.extendedTextMessage.contextInfo.stanzaId;
                convertToVideo(stickerId, replyChatObject);
            } else {
                client.sendMessage(
                    BotsApp.chatId,
                    STOV.TAG_A_VALID_STICKER_MESSAGE,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            }
            return;
        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                BotsApp,
                STOV.ERROR
            );
        }
    },
};

async function webp2mp4File(filePath, VideoPath) {
    try {
        const bodyForm: any = new FormData()
        bodyForm.append('new-image-url', '')
        bodyForm.append('new-image', fs.createReadStream(filePath));
        let {data} = await Axios({
            method: 'post',
            url: 'https://s6.ezgif.com/webp-to-mp4',
            data: bodyForm,
            headers: {
                'Content-Type': `multipart/form-data boundary=${bodyForm._boundary}`
            }
        })
        const bodyFormThen: any = new FormData()
        var $ = cheerio.load(data)
        const file = $('input[name="file"]').attr('value')
        const convert = $('input[name="file"]').attr('value')
        const gotdata = {
            file: file,
            convert: convert
        }
        bodyFormThen.append('file', gotdata.file)
        bodyFormThen.append('convert', gotdata.convert)
        let res = await Axios({
            method: 'post',
            url: 'https://ezgif.com/webp-to-mp4/' + gotdata.file,
            data: bodyFormThen,
            headers: {
                'Content-Type': `multipart/form-data boundary=${bodyFormThen._boundary}`
            }
        })
        $ = cheerio.load(res.data)
        const result = 'https:' + $('div#output > p.outfile > video > source').attr('src');
        return result;
    } catch (err) {
        console.log(err);
    }
}
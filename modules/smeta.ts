import Strings from "../lib/db";
import inputSanitization from "../sidekick/input-sanitization";
import { MessageType } from "../sidekick/message-type";
import { downloadContentFromMessage, proto } from "@adiwajshing/baileys";
import Client from "../sidekick/client";
import BotsApp from "../sidekick/sidekick";
import fs from "fs";

import { Transform } from "stream";
import { Sticker, createSticker, StickerTypes, Categories } from 'wa-sticker-formatter'

const smeta = Strings.smeta;

export = {
    name: "smeta",
    description: smeta.DESCRIPTION,
    extendedDescription: smeta.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false, text: ".smeta" },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        
            if (BotsApp.isReplySticker) {
                //.meta EMOJI1 EMOJI2 EMOJI3
                //convert from string to Categories
                const arg_emojis: Categories[] = [];
                for (let i = 0; i < args.length; i++) {
                    arg_emojis.push(args[i] as Categories);
                    console.log(args[i]);
                }
                
                console.log("AAAAAAA");
                var replyChatObject: any = {
                    message: chat.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage,
                    type: 'sticker'
                };
                console.log("BBBBBBBBBB");
                var stickerId = chat.message.extendedTextMessage.contextInfo.stanzaId;
                const fileName = "./tmp/convert_to_image-" + stickerId;
                const stream: Transform = await downloadContentFromMessage(replyChatObject.message, replyChatObject.type)
                await inputSanitization.saveBuffer(fileName, stream);
                const imagePath = "./tmp/image-" + stickerId + ".png";
                console.log("CCCCCCC");
                
                const sticker = new Sticker(imagePath, {
                    pack: 'My Pack', // The pack name
                    author: 'Me', // The author name
                    type: StickerTypes.FULL, // The sticker type
                    categories: arg_emojis,
                    id: '12345', // The sticker id
                    quality: 50, // The quality of the output file
                    background: '#000000' // The sticker background color (only for full stickers)
                })
                console.log("DDDDDDDD");
                await sticker.toFile('./tmp/sticker-' + stickerId + '.webp')
                console.log("EEEEEEEE");
                await client.sendMessage(
                    BotsApp.chatId,
                    fs.readFileSync('./tmp/sticker-' + stickerId + '.webp'),
                    MessageType.sticker,
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                console.log("FFFFFFFF");
                await inputSanitization.deleteFiles(fileName, imagePath);
                console.log("GGGGGGGG");
            }
        }
                
};
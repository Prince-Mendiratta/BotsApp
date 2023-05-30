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

function getStickerType(arg: string): StickerTypes {
    if (Object.values(StickerTypes).includes(arg as StickerTypes)) {
        return arg as StickerTypes;
    }
    return StickerTypes.FULL;
}

export = {
    name: "smeta",
    description: smeta.DESCRIPTION,
    extendedDescription: smeta.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false, text: ".smeta" },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        
            if (BotsApp.isReplySticker) {
                //it allows more than 1 emoji but its a secret for now
                //convert from string separate by commas to Categories
                const arg_emojis: Categories[] = [];
                for (let i = 0; i < args[0].split(",").length; i++) {
                    arg_emojis.push(args[0].split(",")[i] as Categories);
                }
                
                var replyChatObject: any = {
                    message: chat.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage,
                    type: 'sticker'
                };
                var stickerId = chat.message.extendedTextMessage.contextInfo.stanzaId;
                const filePath = "./tmp/convert_to_image-" + stickerId;
                const fileWebp = './tmp/sticker-' + stickerId + '.webp';
                const stream: Transform = await downloadContentFromMessage(replyChatObject.message, replyChatObject.type)
                await inputSanitization.saveBuffer(filePath, stream);
                
                const sticker = new Sticker(filePath, {
                    categories: arg_emojis,
                    type: getStickerType(args[1]),
                    pack: args[2] ?? 'Botsapp',
                    author: args[3] ?? 'Botsapp',
                    // id: '12345', // The sticker id
                    // quality: 100, // The quality of the output file
                    // background: '#000000' // The sticker background color (only for full stickers)
                })
                await sticker.toFile(fileWebp)
                await client.sendMessage(
                    BotsApp.chatId,
                    fs.readFileSync(fileWebp),
                    MessageType.sticker,
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                await inputSanitization.deleteFiles(filePath, fileWebp);                
            }
        }
                
};
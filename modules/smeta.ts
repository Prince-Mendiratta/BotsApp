import Strings from "../lib/db";
import inputSanitization from "../sidekick/input-sanitization";
import { MessageType } from "../sidekick/message-type";
import { downloadContentFromMessage, proto } from "@adiwajshing/baileys";
import Client from "../sidekick/client";
import BotsApp from "../sidekick/sidekick";
import fs from "fs";
import { readFileSync } from 'fs'

import { Transform } from "stream";
import { Sticker, extractMetadata, StickerTypes, Categories } from 'wa-sticker-formatter'

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

            const stickerRead = readFileSync(filePath)
            let metadata = await extractMetadata(stickerRead) // { emojis: [], 'sticker-pack-id': '', 'sticker-pack-name': '', 'sticker-author-name': '' }

            const sticker = new Sticker(filePath, {
                categories: args[0] != "null" ? arg_emojis : [],
                type: args[1] != "null" ? getStickerType(args[1]) : StickerTypes.FULL,
                pack: args[2] ?? metadata['sticker-pack-name'],
                author: args[3] ?? metadata['sticker-author-name']
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
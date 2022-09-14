import { proto } from "@adiwajshing/baileys";
import format from 'string-format';
import * as googleTTS from 'google-tts-api';
import STRINGS from "../lib/db.js";
import Client from "../sidekick/client.js";
import BotsApp from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";

const tts = STRINGS.tts;

export = {
    name: "tts",
    description: tts.DESCRIPTION,
    extendedDescription: tts.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ['.tts Hello, how are you?', '.tts Hello, how are you? | ja'] },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        let text: string = '';
        let langCode: string = "en";
        if(BotsApp.isTextReply && BotsApp.replyMessage){
            text = BotsApp.replyMessage
        }else if(BotsApp.isTextReply){
            await client.sendMessage(BotsApp.chatId, tts.INCORRECT_REPLY, MessageType.text);
            return;
        }else{
            for (var i = 0; i < args.length; i++) {
                if (args[i] == '|') {
                    langCode = args[i + 1];
                    break;
                }
                text += args[i] + " ";
            }
        }
        const proccessing: proto.WebMessageInfo = await client.sendMessage(BotsApp.chatId, tts.PROCESSING, MessageType.text);
        if (text === "") {
            await client.sendMessage(BotsApp.chatId, tts.NO_INPUT, MessageType.text);
            return await client.deleteMessage(BotsApp.chatId, { id: proccessing.key.id, remoteJid: BotsApp.chatId, fromMe: true });
        }
        if (text.length > 200) {
            await client.sendMessage(BotsApp.chatId, format(tts.TOO_LONG, text.length.toString()), MessageType.text);
        } else {
            try {
                const url: string = googleTTS.getAudioUrl(text, {
                    lang: langCode,
                    slow: false,
                    host: 'https://translate.google.com',
                });
                await client.sendMessage(BotsApp.chatId, { url: url }, MessageType.audio);
            }
            catch (err) {
                console.log(err);
            }
        }
        return await client.deleteMessage(BotsApp.chatId, { id: proccessing.key.id, remoteJid: BotsApp.chatId, fromMe: true });
    }
}
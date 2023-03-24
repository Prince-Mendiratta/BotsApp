import Strings from "../lib/db.js";
import inputSanitization from "../sidekick/input-sanitization.js";
import Client from "../sidekick/client";
import {proto} from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import {MessageType} from "../sidekick/message-type.js";
import {config} from "../config.js";

let BingChat = await import( 'bing-chat')
//
const bing = Strings.bing;
const contexts = {};

//@ts-ignore
const sendMessageToBing = async (api: BingChat, message: string, client: Client, BotsApp: BotsApp, chat: proto.IWebMessageInfo) => {
    const mes = await client.sendMessage(
        BotsApp.chatId,
        bing.TYPING,
        MessageType.text
    );
    if (Object.hasOwn(contexts, BotsApp.sender)) {
        try {
            const res = await api.sendMessage(message, contexts[BotsApp.sender])
            await client.deleteMessage(BotsApp.chatId, mes.key)
            await client.sendMessage(
                BotsApp.chatId,
                bing.HEADER_TEXT + res.text,
                MessageType.text,
                {quoted: chat},
            );

        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }

    } else {
        try {
            const res = await api.sendMessage(message)

            await client.deleteMessage(BotsApp.chatId, mes.key)

            await client.sendMessage(
                BotsApp.chatId,
                bing.HEADER_TEXT + res.text,
                MessageType.text,
                {quoted: chat},
            );
            contexts[BotsApp.sender] = res
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    }
}

export default {
    name: "bing",
    description: bing.DESCRIPTION,
    extendedDescription: bing.EXTENDED_DESCRIPTION,
    demo: {isEnabled: true, text: ".bing"},
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        try {
            if (config.BING_COOKIE.trim().length == 0) {
                client.sendMessage(
                    BotsApp.chatId,
                    bing.NO_COOKIE_SET,
                    MessageType.text
                );
            } else {
                const api = new BingChat.BingChat({
                    cookie: config.BING_COOKIE
                })
                const message = BotsApp.body.slice(5)
                if (message.trim().length == 0) {
                    if (BotsApp.isTextReply && BotsApp.replyMessage.trim().length > 0) {
                        sendMessageToBing(api, BotsApp.replyMessage, client, BotsApp, chat);
                    } else {
                        await client.sendMessage(
                            BotsApp.chatId,
                            "_" + bing.EMPTY_MESSAGE + "_",
                            MessageType.text
                        );
                    }
                } else {
                    if (message.trim() == 'reset') {
                        delete contexts[BotsApp.sender];
                        await client.sendMessage(
                            BotsApp.chatId,
                            bing.CONVERSATION_RESET,
                            MessageType.text
                        );

                    } else {
                        sendMessageToBing(api, message, client, BotsApp, chat);
                    }
                }
            }
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

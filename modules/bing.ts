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

export default {
    name: "bing",
    description: bing.DESCRIPTION,
    extendedDescription: bing.EXTENDED_DESCRIPTION,
    demo: {isEnabled: true, text: ".bing"},
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        //@ts-ignore
        const sendMessageToBing = async (api: BingChat, message: string) => {
            const mes = await client.sendMessage(
                BotsApp.chatId,
                "_Bing is typing..._",
                MessageType.text
            );
            console.log(mes.key);
            if (Object.hasOwn(contexts, BotsApp.sender)) {
                const res = await api.sendMessage(message, contexts[BotsApp.sender])
                await client.deleteMessage(BotsApp.chatId, mes.key)
                client.sendMessage(
                    BotsApp.chatId,
                    "*From Bing:* " + res.text,
                    MessageType.text,
                    {quoted: chat},
                );
                console.log(res.text)

            } else {
                const res = await api.sendMessage(message)
                await client.deleteMessage(BotsApp.chatId, mes.key)

                client.sendMessage(
                    BotsApp.chatId,
                    "*From Bing:* " + res.text,
                    MessageType.text,
                    {quoted: chat},
                );
                contexts[BotsApp.sender] = res
                console.log(res.text)
            }
        }

        try {
            console.log(BotsApp.sender, BotsApp, chat)
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
                        sendMessageToBing(api, BotsApp.replyMessage);
                    } else {
                        client.sendMessage(
                            BotsApp.chatId,
                            bing.EMPTY_MESSAGE,
                            MessageType.text
                        );
                    }
                } else {
                    sendMessageToBing(api, message);
                }
            }
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

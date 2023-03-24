import Strings from "../lib/db.js";
import inputSanitization from "../sidekick/input-sanitization.js";
import Client from "../sidekick/client";
import {proto} from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import {MessageType} from "../sidekick/message-type.js";
import {config} from "../config.js";

let ChatGPT = await import( 'chatgpt')
//
const gpt = Strings.gpt;
const contexts = {};

export default {
    name: "gpt",
    description: gpt.DESCRIPTION,
    extendedDescription: gpt.EXTENDED_DESCRIPTION,
    demo: {isEnabled: true, text: ".gpt"},
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        try {
            //@ts-ignore
            const sendMessageToBing = async (api: BingChat, message: string) => {
                const mes = await client.sendMessage(
                    BotsApp.chatId,
                    "_ChatGPT is typing..._",
                    MessageType.text
                );
                console.log(mes.key);
                if (Object.hasOwn(contexts, BotsApp.sender)) {
                    try {
                        const res = await api.sendMessage(message, {
                            conversationId: contexts[BotsApp.sender].conversationId,
                            parentMessageId: contexts[BotsApp.sender].id
                        })
                        await client.deleteMessage(BotsApp.chatId, mes.key)
                        await client.sendMessage(
                            BotsApp.chatId,
                            "*From ChatGPT: type .gpt reset to start a new conversation* \n" + res.text,
                            MessageType.text,
                            {quoted: chat},
                        );


                        console.log(res.text)
                    } catch (err) {
                        await inputSanitization.handleError(err, client, BotsApp);
                    }

                } else {
                    try {
                        const res = await api.sendMessage(message)

                        await client.deleteMessage(BotsApp.chatId, mes.key)

                         await client.sendMessage(
                            BotsApp.chatId,
                            "*From ChatGPT: type .gpt reset to start a new conversation* \n" + res.text,
                            MessageType.text,
                            {quoted: chat},
                        );
                        contexts[BotsApp.sender] = res

                        console.log(res.text)
                    } catch (err) {
                        await inputSanitization.handleError(err, client, BotsApp);
                    }
                }
            }


            console.log(BotsApp.sender, BotsApp, chat)
            if (config.OPENAI_ACCESS_TOKEN.trim().length == 0) {
                client.sendMessage(
                    BotsApp.chatId,
                    gpt.NO_COOKIE_SET,
                    MessageType.text
                );
            } else {
                const api = new ChatGPT.ChatGPTUnofficialProxyAPI({
                    accessToken: config.OPENAI_ACCESS_TOKEN
                })
                const message = BotsApp.body.slice(5)
                if (message.trim().length == 0) {
                    if (BotsApp.isTextReply && BotsApp.replyMessage.trim().length > 0) {
                        sendMessageToBing(api, BotsApp.replyMessage);
                    } else {
                        client.sendMessage(
                            BotsApp.chatId,
                            "_" + gpt.EMPTY_MESSAGE + "_",
                            MessageType.text
                        );
                    }
                } else {
                    if (message.trim() == 'reset') {
                        delete contexts[BotsApp.sender];
                        client.sendMessage(
                            BotsApp.chatId,
                            gpt.CONVERSATION_RESET,
                            MessageType.text
                        );
                    } else {
                        sendMessageToBing(api, message);
                    }
                }
            }
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

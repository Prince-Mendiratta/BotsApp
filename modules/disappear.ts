import STRINGS from "../lib/db.js";
import inputSanitization from "../sidekick/input-sanitization";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type"

module.exports = {
    name: "disappear",
    description: STRINGS.disappear.DESCRIPTION,
    extendedDescription: STRINGS.disappear.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: [".disappear", ".disappear off"] },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        try {
            var time: any = 7 * 24 * 60 * 60;
            if (BotsApp.isPm) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.general.NOT_A_GROUP,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            if (BotsApp.isGroup) {
                if (chat.message.extendedTextMessage == null) {
                    await client.sock.sendMessage(
                        BotsApp.chatId,
                        {disappearingMessagesInChat: time}
                        ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                } else {
                    await client.sock.sendMessage(
                        BotsApp.chatId,
                        {disappearingMessagesInChat: false}
                        ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                }
                return;
            }
            if (chat.message.extendedTextMessage.contextInfo.expiration == 0) {
                time = 7 * 24 * 60 * 60;
            } else {
                time = false;
            }
            await client.sock.sendMessage(
                BotsApp.chatId,
                {disappearingMessagesInChat: time}
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            return;
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

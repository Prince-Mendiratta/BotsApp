import Strings from "../lib/db";
const ADMINS = Strings.admins;
import inputSanitization from "../sidekick/input-sanitization";
import Client from "../sidekick/client.js";
import BotsApp from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
import { proto } from "@adiwajshing/baileys";

module.exports = {
    name: "admins",
    description: ADMINS.DESCRIPTION,
    extendedDescription: ADMINS.EXTENDED_DESCRIPTION,
    demo: { text: ".admins", isEnabled: true },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        try {
            if (!BotsApp.isGroup) {
                client.sendMessage(
                    BotsApp.chatId,
                    ADMINS.NOT_GROUP_CHAT,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }

            let message: string = "";
            await client.getGroupMetaData(BotsApp.chatId, BotsApp);
            for (let admin of BotsApp.groupAdmins) {
                let number: string = admin.split("@")[0];
                message += `@${number} `;
            }

            client.sendMessage(BotsApp.chatId, message, MessageType.text, {
                contextInfo: {
                    mentionedJid: BotsApp.groupAdmins,
                },
            }).catch(err => inputSanitization.handleError(err, client, BotsApp));
            return;
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

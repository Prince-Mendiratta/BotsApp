import inputSanitization from "../sidekick/input-sanitization";
import STRINGS from "../lib/db.js";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type"

module.exports = {
    name: "invite",
    description: STRINGS.invite.DESCRIPTION,
    extendedDescription: STRINGS.invite.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        try {
            if (!BotsApp.isGroup) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.general.NOT_A_GROUP,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            await client.getGroupMetaData(BotsApp.chatId, BotsApp);
            if (!BotsApp.isBotGroupAdmin) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.general.BOT_NOT_ADMIN,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            const code = await client.sock.groupInviteCode(BotsApp.chatId);
            if (BotsApp.isTextReply) {
                client.sendMessage(
                    chat.message.extendedTextMessage.contextInfo.participant,
                    "https://chat.whatsapp.com/" + code,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.invite.LINK_SENT,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            client.sendMessage(
                BotsApp.chatId,
                "https://chat.whatsapp.com/" + code,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            return;
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

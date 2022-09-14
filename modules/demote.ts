import inputSanitization from "../sidekick/input-sanitization";
import String from "../lib/db.js";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
const REPLY = String.demote;

module.exports = {
    name: "demote",
    description: REPLY.DESCRIPTION,
    extendedDescription: REPLY.EXTENDED_DESCRIPTION,
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        try {
            if (!BotsApp.isGroup) {
                client.sendMessage(
                    BotsApp.chatId,
                    REPLY.NOT_A_GROUP,
                    MessageType.text
                );
                return;
            }
            await client.getGroupMetaData(BotsApp.chatId, BotsApp);
            if (!BotsApp.isBotGroupAdmin) {
                client.sendMessage(
                    BotsApp.chatId,
                    REPLY.BOT_NOT_ADMIN,
                    MessageType.text
                );
                return;
            }
            if (!BotsApp.isTextReply && typeof args[0] == "undefined") {
                client.sendMessage(
                    BotsApp.chatId,
                    REPLY.MESSAGE_NOT_TAGGED,
                    MessageType.text
                );
                return;
            }

            const reply = chat.message.extendedTextMessage;
            if (BotsApp.isTextReply) {
                var contact = reply.contextInfo.participant.split("@")[0];
            } else {
                var contact = await inputSanitization.getCleanedContact(
                    args,
                    client,
                    BotsApp
                );
            }
            var admin = false;
            var isMember = await inputSanitization.isMember(
                contact,
                BotsApp.groupMembers
            );
            var owner = false;
            for (const index in BotsApp.groupMembers) {
                if (contact == BotsApp.groupMembers[index].id.split("@")[0]) {
                    console.log(BotsApp.groupMembers[index]);
                    owner = BotsApp.groupMembers[index].admin === 'superadmin';
                    admin = BotsApp.groupMembers[index].admin != undefined;
                }
            }

            if (owner) {
                client.sendMessage(
                    BotsApp.chatId,
                    "*" + contact + " is the owner of the group*",
                    MessageType.text
                );
                return;
            }

            if (isMember) {
                if (admin) {
                    const arr = [contact + "@s.whatsapp.net"];
                    await client.sock.groupParticipantsUpdate(BotsApp.chatId, arr, 'demote');
                    client.sendMessage(
                        BotsApp.chatId,
                        "*" + contact + " is demoted from admin*",
                        MessageType.text
                    );
                    return;
                } else {
                    client.sendMessage(
                        BotsApp.chatId,
                        "*" + contact + " was not an admin*",
                        MessageType.text
                    );
                    return;
                }
            }
            if (!isMember) {
                if (contact === undefined) {
                    return;
                }

                client.sendMessage(
                    BotsApp.chatId,
                    REPLY.PERSON_NOT_IN_GROUP,
                    MessageType.text
                );
                return;
            }
            return;
        } catch (err) {
            if (err === "NumberInvalid") {
                await inputSanitization.handleError(
                    err,
                    client,
                    BotsApp,
                    "```Invalid number ```" + args[0]
                );
            } else {
                await inputSanitization.handleError(err, client, BotsApp);
            }
        }
    },
};

import chalk from "chalk";
import STRINGS from "../lib/db.js";
import inputSanitization from "../sidekick/input-sanitization";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";

module.exports = {
    name: "remove",
    description: STRINGS.remove.DESCRIPTION,
    extendedDescription: STRINGS.remove.EXTENDED_DESCRIPTION,
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
            let owner: string;
            for (const index in BotsApp.groupMembers) {
                if (BotsApp.groupMembers[index].admin === 'superadmin') {
                    owner = BotsApp.groupMembers[index].id.split("@")[0];
                }
            }
            if (BotsApp.isTextReply) {
                let PersonToRemove =
                    chat.message.extendedTextMessage.contextInfo.participant;
                if (PersonToRemove === owner + "@s.whatsapp.net") {
                    client.sendMessage(
                        BotsApp.chatId,
                        "*" + owner + " is the owner of the group*",
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                    return;
                }
                if (PersonToRemove === BotsApp.owner) {
                    client.sendMessage(
                        BotsApp.chatId,
                        "```Why man, why?! Why would you use my powers to remove myself from the group?!🥺```\n*Request Rejected.* 😤",
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                    return;
                }
                var isMember = inputSanitization.isMember(
                    PersonToRemove,
                    BotsApp.groupMembers
                );
                if (!isMember) {
                    client.sendMessage(
                        BotsApp.chatId,
                        "*person is not in the group*",
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                }
                try {
                    if (PersonToRemove) {
                        await client.sock.groupParticipantsUpdate(BotsApp.chatId, [PersonToRemove], 'remove').catch(err => inputSanitization.handleError(err, client, BotsApp));
                        return;
                    }
                } catch (err) {
                    throw err;
                }
                return;
            }
            if (!args[0]) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.remove.INPUT_ERROR,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            if (args[0][0] == "@") {
                const number = args[0].substring(1);
                if (parseInt(args[0]) === NaN) {
                    client.sendMessage(
                        BotsApp.chatId,
                        STRINGS.remove.INPUT_ERROR,
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                    return;
                }

                if((number + "@s.whatsapp.net") === BotsApp.owner){
                    client.sendMessage(
                        BotsApp.chatId,
                        "```Why man, why?! Why would you use my powers to remove myself from the group?!🥺```\n*Request Rejected.* 😤",
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                    return;
                }

                if (!(number === owner)) {
                    await client.sock.groupParticipantsUpdate(BotsApp.chatId, [number + "@s.whatsapp.net"], 'remove').catch(err => inputSanitization.handleError(err, client, BotsApp));
                    return;
                } else {
                    client.sendMessage(
                        BotsApp.chatId,
                        "*" + owner + " is the owner of the group*",
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                    return;
                }
            }
            client.sendMessage(
                BotsApp.chatId,
                STRINGS.remove.INPUT_ERROR,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
            return;
        }
    },
};

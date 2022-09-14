import Strings from "../lib/db";
import format from "string-format";
import inputSanitization from "../sidekick/input-sanitization";
import Blacklist from "../database/blacklist";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
const abl = Strings.abl;

module.exports = {
    name: "abl",
    description: abl.DESCRIPTION,
    extendedDescription: abl.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".abl" },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        try {
            if (BotsApp.isPm && BotsApp.fromMe) {
                let PersonToBlacklist = BotsApp.chatId;
                Blacklist.addBlacklistUser(PersonToBlacklist, "");
                client.sendMessage(
                    BotsApp.chatId,
                    format(abl.PM_ACKNOWLEDGEMENT, PersonToBlacklist.substring(0, PersonToBlacklist.indexOf("@"))),
                    MessageType.text
                );
                return;
            } else {
                await client.getGroupMetaData(BotsApp.chatId, BotsApp);
                if (args.length > 0) {
                    let PersonToBlacklist = await inputSanitization.getCleanedContact(
                        args,
                        client,
                        BotsApp);
                    if (PersonToBlacklist === undefined) return;
                    PersonToBlacklist += "@s.whatsapp.net";
                    if (BotsApp.owner === PersonToBlacklist) {
                        client.sendMessage(
                            BotsApp.chatId,
                            abl.CAN_NOT_BLACKLIST_BOT,
                            MessageType.text
                        );
                        return;
                    }
                    Blacklist.addBlacklistUser(
                        PersonToBlacklist,
                        BotsApp.chatId
                    );
                    client.sendMessage(
                        BotsApp.chatId,
                        format(abl.GRP_ACKNOWLEDGEMENT, PersonToBlacklist.substring(0, PersonToBlacklist.indexOf("@"))),
                        MessageType.text
                    );
                    return;
                } else if (BotsApp.isTextReply) {
                    let PersonToBlacklist = BotsApp.replyParticipant;
                    if (BotsApp.owner === PersonToBlacklist) {
                        client.sendMessage(
                            BotsApp.chatId,
                            abl.CAN_NOT_BLACKLIST_BOT,
                            MessageType.text
                        );
                        return;
                    }
                    Blacklist.addBlacklistUser(
                        PersonToBlacklist,
                        BotsApp.chatId
                    );
                    client.sendMessage(
                        BotsApp.chatId,
                        format(abl.GRP_ACKNOWLEDGEMENT, PersonToBlacklist.substring(0, PersonToBlacklist.indexOf("@"))),
                        MessageType.text
                    );
                    return;
                } else {
                    Blacklist.addBlacklistUser("", BotsApp.chatId);
                    client.sendMessage(
                        BotsApp.chatId,
                        format(abl.GRP_BAN, BotsApp.groupName),
                        MessageType.text
                    );
                    return;
                }
            }
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

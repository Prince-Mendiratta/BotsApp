import Strings from "../lib/db";
import format from "string-format";
import inputSanitization from "../sidekick/input-sanitization";
import Blacklist from "../database/blacklist";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
const rbl = Strings.rbl;

module.exports = {
    name: "rbl",
    description: rbl.DESCRIPTION,
    extendedDescription: rbl.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".rbl" },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        try {
            if (BotsApp.isPm && BotsApp.fromMe) {
                let PersonToRemoveFromBlacklist = BotsApp.chatId;
                if (!(await Blacklist.getBlacklistUser(PersonToRemoveFromBlacklist, ""))) {
                    client.sendMessage(
                        BotsApp.chatId,
                        format(rbl.NOT_IN_BLACKLIST, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))),
                        MessageType.text
                    );
                    return;
                }
                Blacklist.removeBlacklistUser(PersonToRemoveFromBlacklist, "");
                client.sendMessage(
                    BotsApp.chatId,
                    format(rbl.PM_ACKNOWLEDGEMENT, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))),
                    MessageType.text
                );
                return;
            } else {
                await client.getGroupMetaData(BotsApp.chatId, BotsApp);
                if (args.length > 0) {
                    let PersonToRemoveFromBlacklist =
                        await inputSanitization.getCleanedContact(
                            args,
                            client,
                            BotsApp
                        );

                    if (PersonToRemoveFromBlacklist === undefined) return;
                    PersonToRemoveFromBlacklist += "@s.whatsapp.net";
                    if (
                        !(await Blacklist.getBlacklistUser(
                            PersonToRemoveFromBlacklist,
                            BotsApp.chatId
                        ))
                    ) {
                        client.sendMessage(
                            BotsApp.chatId,
                            format(rbl.NOT_IN_BLACKLIST, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))),
                            MessageType.text
                        );
                        return;
                    }
                    Blacklist.removeBlacklistUser(
                        PersonToRemoveFromBlacklist,
                        BotsApp.chatId
                    );
                    client.sendMessage(
                        BotsApp.chatId,
                        format(rbl.GRP_ACKNOWLEDGEMENT, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))),
                        MessageType.text
                    );
                    return;
                } else if (BotsApp.isTextReply) {
                    let PersonToRemoveFromBlacklist = BotsApp.replyParticipant;
                    if (
                        !(await Blacklist.getBlacklistUser(
                            PersonToRemoveFromBlacklist,
                            BotsApp.chatId
                        ))
                    ) {
                        client.sendMessage(
                            BotsApp.chatId,
                            format(rbl.NOT_IN_BLACKLIST, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))),
                            MessageType.text
                        );
                        return;
                    }
                    Blacklist.removeBlacklistUser(
                        PersonToRemoveFromBlacklist,
                        BotsApp.chatId
                    );
                    client.sendMessage(
                        BotsApp.chatId,
                        format(rbl.GRP_ACKNOWLEDGEMENT, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))),
                        MessageType.text
                    );
                    return;
                } else {
                    if (
                        !(await Blacklist.getBlacklistUser("", BotsApp.chatId))
                    ) {
                        client.sendMessage(
                            BotsApp.chatId,
                            format(rbl.NOT_IN_BLACKLIST, BotsApp.groupName),
                            MessageType.text
                        );
                        return;
                    }
                    Blacklist.removeBlacklistUser("", BotsApp.chatId);
                    client.sendMessage(
                        BotsApp.chatId,
                        format(rbl.GRP_BAN, BotsApp.groupName),
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

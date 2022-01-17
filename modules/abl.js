const { MessageType } = require("@adiwajshing/baileys");
const Strings = require("../lib/db");
const format = require("python-format-js");
const inputSanitization = require("../sidekick/input-sanitization");
const abl = Strings.abl;
const Blacklist = require("../database/blacklist");

module.exports = {
    name: "abl",
    description: abl.DESCRIPTION,
    extendedDescription: abl.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".abl" },
    async handle(client, chat, BotsApp, args) {
        try {
            if (BotsApp.isPm && BotsApp.fromMe) {
                let PersonToBlacklist = BotsApp.chatId;
                Blacklist.addBlacklistUser(PersonToBlacklist, "");
                return client.sendMessage(
                    BotsApp.chatId,
                    abl.PM_ACKNOWLEDGEMENT.format({
                        user: PersonToBlacklist.substring(
                            0,
                            PersonToBlacklist.indexOf("@")
                        ),
                    }),
                    MessageType.text
                );
            } else {
                if (args.length > 0) {
                    let PersonToBlacklist =
                        await inputSanitization.getCleanedContact(
                            args,
                            client,
                            BotsApp
                        );
                    if (PersonToBlacklist === undefined) return;
                    PersonToBlacklist += "@s.whatsapp.net";
                    if (BotsApp.owner === PersonToBlacklist) {
                        return client.sendMessage(
                            BotsApp.chatId,
                            abl.CAN_NOT_BLACKLIST_BOT,
                            MessageType.text
                        );
                    }
                    Blacklist.addBlacklistUser(
                        PersonToBlacklist,
                        BotsApp.chatId
                    );
                    return client.sendMessage(
                        BotsApp.chatId,
                        abl.GRP_ACKNOWLEDGEMENT.format({
                            user: PersonToBlacklist.substring(
                                0,
                                PersonToBlacklist.indexOf("@")
                            ),
                        }),
                        MessageType.text
                    );
                } else if (BotsApp.isReply) {
                    let PersonToBlacklist = BotsApp.replyParticipant;
                    if (BotsApp.owner === PersonToBlacklist) {
                        return client.sendMessage(
                            BotsApp.chatId,
                            abl.CAN_NOT_BLACKLIST_BOT,
                            MessageType.text
                        );
                    }
                    Blacklist.addBlacklistUser(
                        PersonToBlacklist,
                        BotsApp.chatId
                    );
                    return client.sendMessage(
                        BotsApp.chatId,
                        abl.GRP_ACKNOWLEDGEMENT.format({
                            user: PersonToBlacklist.substring(
                                0,
                                PersonToBlacklist.indexOf("@")
                            ),
                        }),
                        MessageType.text
                    );
                } else {
                    Blacklist.addBlacklistUser("", BotsApp.chatId);
                    return client.sendMessage(
                        BotsApp.chatId,
                        abl.GRP_BAN.format({ user: BotsApp.groupName }),
                        MessageType.text
                    );
                }
            }
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

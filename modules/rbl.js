const { MessageType } = require("@adiwajshing/baileys");
const Strings = require("../lib/db");
const format = require("python-format-js");
const inputSanitization = require("../sidekick/input-sanitization");
const rbl = Strings.rbl;
const Blacklist = require("../database/blacklist");

module.exports = {
    name: "rbl",
    description: rbl.DESCRIPTION,
    extendedDescription: rbl.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".rbl" },
    async handle(client, chat, BotsApp, args) {
        try {
            if (BotsApp.isPm && BotsApp.fromMe) {
                let PersonToRemoveFromBlacklist = BotsApp.chatId;
                if (
                    !(await Blacklist.getBlacklistUser(
                        PersonToRemoveFromBlacklist,
                        ""
                    ))
                ) {
                    return client.sendMessage(
                        BotsApp.chatId,
                        rbl.NOT_IN_BLACKLISTformat({
                            user: PersonToRemoveFromBlacklist.substring(
                                0,
                                PersonToRemoveFromBlacklist.indexOf("@")
                            ),
                        }),
                        MessageType.text
                    );
                }
                Blacklist.removeBlacklistUser(PersonToRemoveFromBlacklist, "");
                return client.sendMessage(
                    BotsApp.chatId,
                    rbl.PM_ACKNOWLEDGEMENT.format({
                        user: PersonToRemoveFromBlacklist.substring(
                            0,
                            PersonToRemoveFromBlacklist.indexOf("@")
                        ),
                    }),
                    MessageType.text
                );
            } else {
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
                        return client.sendMessage(
                            BotsApp.chatId,
                            rbl.NOT_IN_BLACKLIST.format({
                                user: PersonToRemoveFromBlacklist.substring(
                                    0,
                                    PersonToRemoveFromBlacklist.indexOf("@")
                                ),
                            }),
                            MessageType.text
                        );
                    }
                    Blacklist.removeBlacklistUser(
                        PersonToRemoveFromBlacklist,
                        BotsApp.chatId
                    );
                    return client.sendMessage(
                        BotsApp.chatId,
                        rbl.GRP_ACKNOWLEDGEMENT.format({
                            user: PersonToRemoveFromBlacklist.substring(
                                0,
                                PersonToRemoveFromBlacklist.indexOf("@")
                            ),
                        }),
                        MessageType.text
                    );
                } else if (BotsApp.isReply) {
                    let PersonToRemoveFromBlacklist = BotsApp.replyParticipant;
                    if (
                        !(await Blacklist.getBlacklistUser(
                            PersonToRemoveFromBlacklist,
                            BotsApp.chatId
                        ))
                    ) {
                        return client.sendMessage(
                            BotsApp.chatId,
                            rbl.NOT_IN_BLACKLIST.format({
                                user: PersonToRemoveFromBlacklist.substring(
                                    0,
                                    PersonToRemoveFromBlacklist.indexOf("@")
                                ),
                            }),
                            MessageType.text
                        );
                    }
                    Blacklist.removeBlacklistUser(
                        PersonToRemoveFromBlacklist,
                        BotsApp.chatId
                    );
                    return client.sendMessage(
                        BotsApp.chatId,
                        rbl.GRP_ACKNOWLEDGEMENT.format({
                            user: PersonToRemoveFromBlacklist.substring(
                                0,
                                PersonToRemoveFromBlacklist.indexOf("@")
                            ),
                        }),
                        MessageType.text
                    );
                } else {
                    if (
                        !(await Blacklist.getBlacklistUser("", BotsApp.chatId))
                    ) {
                        return client.sendMessage(
                            BotsApp.chatId,
                            rbl.NOT_IN_BLACKLIST.format({
                                user: BotsApp.groupName,
                            }),
                            MessageType.text
                        );
                    }
                    Blacklist.removeBlacklistUser("", BotsApp.chatId);
                    return client.sendMessage(
                        BotsApp.chatId,
                        rbl.GRP_BAN.format({ user: BotsApp.groupName }),
                        MessageType.text
                    );
                }
            }
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

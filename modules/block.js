const { MessageType } = require("@adiwajshing/baileys");
const Reply = require("../lib/db.js").block;
const inputSanitization = require("../sidekick/input-sanitization");

module.exports = {
    name: "block",
    description: Reply.DESCRIPTION,
    extendedDescription: Reply.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client, chat, BotsApp, args) {
        try {
            var JID = "";
            var jidNumber;
            if (BotsApp.replyParticipant === BotsApp.owner) {
                client.sendMessage(
                    BotsApp.chatId,
                    "Bot can not block itself",
                    MessageType.text
                );
                return;
            }
            if (args.length > 0) {
                if (isNaN(args[0]) || args[0][0] === "+") {
                    if (args[0][0] === "@" || args[0][0] === "+") {
                        jidNumber = args[0].substring(1, args[0].length + 1);
                    } else {
                        client.sendMessage(
                            BotsApp.chatId,
                            Reply.NUMBER_SYNTAX_ERROR,
                            MessageType.text
                        );
                        return;
                    }
                } else {
                    jidNumber = args[0];
                }
                if (jidNumber.length < 10 || jidNumber.length > 13) {
                    client.sendMessage(
                        BotsApp.chatId,
                        Reply.NUMBER_SYNTAX_ERROR,
                        MessageType.text
                    );
                    return;
                } else if (jidNumber.length === 10) {
                    jidNumber = "91" + jidNumber;
                }
                JID = jidNumber + "@s.whatsapp.net";
            } else if (!BotsApp.isGroup) {
                if (args.length === 0) {
                    client.sendMessage(
                        BotsApp.chatId,
                        Reply.MESSAGE_NOT_TAGGED,
                        MessageType.text
                    );
                    return;
                }
                JID = BotsApp.chatId;
                jidNumber = JID.substring(0, JID.indexOf("@"));
            } else {
                if (BotsApp.isReply) {
                    JID = BotsApp.replyParticipant;

                    jidNumber = JID.substring(0, JID.indexOf("@"));
                } else {
                    client.sendMessage(
                        BotsApp.chatId,
                        Reply.MESSAGE_NOT_TAGGED,
                        MessageType.text
                    );
                    return;
                }
            }
            client.blockUser(JID, "add");
            client.sendMessage(
                BotsApp.chatId,
                "*" + jidNumber + " blocked successfully.*",
                MessageType.text
            );
        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                BotsApp,
                Reply.MESSAGE_NOT_TAGGED
            );
        }
    },
};

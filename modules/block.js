const { MessageType } = require("@adiwajshing/baileys");
const Reply = require("../lib/db.js").block;
const inputSanitization = require("../sidekick/input-sanitization");

module.exports = {
    name: "block",
    description: Reply.DESCRIPTION,
    extendedDescription: Reply.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        try {
            const reply = chat.message.extendedTextMessage;
            var contact = "";
            if (!args.length > 0) {
                contact = reply.contextInfo.participant.split("@")[0];
            } else {
                contact = await inputSanitization.getCleanedContact(
                    args,
                    client,
                    BotsApp
                );
            }

            if (contact === BotsApp.owner.split("@")[0]) {
                client.sendMessage(
                    BotsApp.chatId,
                    Reply.NOT_BLOCK_BOT,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
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
                        ).catch(err => inputSanitization.handleError(err, client, BotsApp));
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
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
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
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
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
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                    return;
                }
            }
            var JID = contact + "@s.whatsapp.net";
            client.blockUser(JID, "add");
            client.sendMessage(
                BotsApp.chatId,
                "*" + contact + " blocked successfully.*",
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
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

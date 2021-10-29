const { MessageType } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const Reply =require("../lib/db.js").unblock;

module.exports = {
    name: "unblock",
    description: Reply.DESCRIPTION,
    extendedDescription: Reply.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client, chat, BotsApp, args) {
        try{
            if (!BotsApp.isReply && typeof args[0] == "undefined") {
                client.sendMessage(
                    BotsApp.chatId,
                    Reply.MESSAGE_NOT_TAGGED,
                    MessageType.text
                );
                return;
            }
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
                    Reply.NOT_UNBLOCK_BOT,
                    MessageType.text
                );
                return;
            }

            if(contact === ""){
                client.sendMessage(
                    BotsApp.chatId,
                    Reply.MESSAGE_NOT_TAGGED,
                    MessageType.text
                );
                return;
            }
                var JID = contact + "@s.whatsapp.net";
                client.blockUser(JID, "remove");
                client.sendMessage(
                    BotsApp.chatId,
                    "*" + contact + " unblocked successfully.*",
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
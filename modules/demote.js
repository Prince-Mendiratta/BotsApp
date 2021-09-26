const { MessageType } = require("@adiwajshing/baileys");
const chalk = require("chalk");
const number = require("../sidekick/input-sanitization");
const String = require("../lib/db.js");
const REPLY = String.demote;
module.exports = {
    name: "demote",
    description: REPLY.DESCRIPTION,
    extendedDescription: REPLY.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(
                BotsApp.chatId,
                REPLY.NOT_A_GROUP,
                MessageType.text
            );
            return;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(
                BotsApp.chatId,
                REPLY.BOT_NOT_ADMIN,
                MessageType.text
            );
            return;
        }
        const reply = chat.message.extendedTextMessage;
        try {
            if (!args.length > 0) {
                var contact = reply.contextInfo.participant.split("@")[0];
            } else {
                var contact = await number.getCleanedContact(args, client, BotsApp);
            }

            var admin = false;
            var isMember = false;
            for (const index in BotsApp.groupMembers) {
                if (contact == BotsApp.groupMembers[index].id.split("@")[0]) {
                    isMember = true;
                    if (BotsApp.groupMembers[index].isAdmin) {
                        admin = true;
                    }
                }
            }

            if (isMember) {
                if (admin == true) {
                    const arr = [contact + "@s.whatsapp.net"];
                    client.groupDemoteAdmin(BotsApp.chatId, arr);
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
                client.sendMessage(
                    BotsApp.chatId,
                    REPLY.PERSON_NOT_IN_GROUP,
                    MessageType.text
                );
                return;
            }
        } catch (err) {
            if (typeof(contact) == 'undefined' || err instanceof TypeError) {
                if (reply == null && typeof(args[0]) == 'undefined') {
                    console.log(
                        chalk.redBright.bold(REPLY.MESSAGE_NOT_TAGGED + err));
                    client.sendMessage(BotsApp.chatId, REPLY.MESSAGE_NOT_TAGGED, MessageType.text);
                }
            }   
            else if(err === "NumberInvalid"){
                client.sendMessage(BotsApp.chatId, "Number invalid " + args[0], MessageType.text);
            }
            else {
                console.log(err);
            }
        }
    }
};
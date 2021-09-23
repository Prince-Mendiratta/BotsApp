const { MessageType } = require("@adiwajshing/baileys");
const chalk = require("chalk");
const number = require("../sidekick/input-sanitization");

module.exports = {
    name: "promote",
    description: "Promote",
    extendedDescription: "Promote member to admin",
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, "*This is not a group*", MessageType.text);
            return;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.chatId, "*I am not group admin*", MessageType.text);
            return;
        }
        const reply = chat.message.extendedTextMessage;
        try {
            if (!args.length > 0) {
                var contact = reply.contextInfo.participant.split('@')[0];
            } else {
                var contact = await number.getCleanedContact(args, client, BotsApp);
            }

            var admin = false;
            var isMember = false;
            for (const index in BotsApp.groupMembers) {
                if (contact == BotsApp.groupMembers[index].id.split('@')[0]) {

                    isMember = true;
                    if (BotsApp.groupMembers[index].isAdmin) {
                        admin = true;

                    }
                }
            }

            if (isMember) {
                if (!admin == true) {
                    const arr = [contact + "@s.whatsapp.net"];
                    client.groupMakeAdmin(BotsApp.chatId, arr)
                    client.sendMessage(BotsApp.chatId, "*" + contact + " promoted to admin*", MessageType.text);
                } else {
                    client.sendMessage(BotsApp.chatId, "*" + contact + " is already an admin*", MessageType.text);
                }
            }
            if (!isMember && contact.length >= 10 && contact.length < 13) {

                client.sendMessage(
                    BotsApp.chatId,
                    "*Person is not in the group*",
                    MessageType.text
                );
                return;
            }

        } catch (err) {
            if (typeof(contact) == 'undefined' || err instanceof TypeError) {
                if (reply == null && typeof(args[0]) == 'undefined') {
                    console.log(
                        chalk.redBright.bold("Please reply or tag the person for promotion: " + err));
                    client.sendMessage(BotsApp.chatId, "*Please reply or tag / enter contact of the person to be promoted*", MessageType.text);
                }

            } else {
                console.log(err);
            }
        }
    }
}
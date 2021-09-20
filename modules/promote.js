const { MessageType } = require("@adiwajshing/baileys");
const chalk = require("chalk");
const number = require("../sidekick/helper");
module.exports = {
  name: "promote",
  description: "Promote",
  extendedDescription: "Promote member to admin",
  async handle(client, chat, BotsApp, args) {
    if (!BotsApp.isGroup) {
        client.sendMessage(
            BotsApp.from,
            "*This is not a group*",
            MessageType.text
        );
        return;
    }
    if (!BotsApp.isBotGroupAdmin) {
        client.sendMessage(
            BotsApp.from,
            "*I am not group admin*",
            MessageType.text
        );
        return;
    }
    const reply = chat.messages.all()[0].message.extendedTextMessage;
    try {
        if (!args.length > 0) {
            var contact = reply.contextInfo.participant.split("@")[0];
        } else {
            var contact = await number.helper(args, client, BotsApp);
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
            if (!admin == true) {
                const arr = [contact + "@s.whatsapp.net"];
                client.groupMakeAdmin(BotsApp.from, arr);
                client.sendMessage(
                    BotsApp.from,
                    "*" + contact + " promoted to admin*",
                    MessageType.text
                );
            } else {
                client.sendMessage(
                    BotsApp.from,
                    "*" + contact + " is already an admin*",
                    MessageType.text
                );
            }
        } else {
            client.sendMessage(
                BotsApp.from,
                "*Enter valid contact number*",
                MessageType.text
            );
            return;
        }
    } catch (err) {
        if (typeof (contact) == "undefined" || err instanceof TypeError) {
            console.log(
                chalk.redBright.bold(
                    "Please reply to the person for promotion: " + err
                )
            );
            client.sendMessage(
                BotsApp.from,
                "*Please reply to someone for promotion*",
                MessageType.text
            );
        } else {
            console.log(err);
        }
    }
},
};
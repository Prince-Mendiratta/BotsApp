const { MessageType } = require("@adiwajshing/baileys");
const chalk = require("chalk");
const STRINGS = require("../lib/db.js");
const inputSanitization = require("../sidekick/input-sanitization");

module.exports = {
    name: "remove",
    description: STRINGS.remove.DESCRIPTION,
    extendedDescription: STRINGS.remove.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client, chat, BotsApp, args) {
        try {
            if (!BotsApp.isGroup) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.general.NOT_A_GROUP,
                    MessageType.text
                );
                return;
            }
            if (!BotsApp.isBotGroupAdmin) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.general.BOT_NOT_ADMIN,
                    MessageType.text
                );
                return;
            }
            let owner = BotsApp.chatId.split("-")[0];
            if (BotsApp.isReply) {
                let PersonToRemove =
                    chat.message.extendedTextMessage.contextInfo.participant;
                if (PersonToRemove === owner + "@s.whatsapp.net") {
                    client.sendMessage(
                        BotsApp.chatId,
                        "*" + owner + " is the owner of the group*",
                        MessageType.text
                    );
                    return;
                }
                var isMember = inputSanitization.isMember(
                    PersonToRemove,
                    BotsApp.groupMembers
                );
                if (!isMember) {
                    client.sendMessage(
                        BotsApp.chatId,
                        "*person is not in the group*",
                        MessageType.text
                    );
                }
                try {
                    if (PersonToRemove) {
                        client.groupRemove(BotsApp.chatId, [PersonToRemove]);
                        return;
                    }
                } catch (err) {
                    throw err;
                }
                return;
            }
            if (!args[0]) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.remove.INPUT_ERROR,
                    MessageType.text
                );
                return;
            }
            if (args[0][0] == "@") {
                const number = args[0].substring(1);
                if (isNaN(number)) {
                    client.sendMessage(
                        BotsApp.chatId,
                        STRINGS.remove.INPUT_ERROR,
                        MessageType.text
                    );
                    return;
                }

                if (!(number === owner)) {
                    client.groupRemove(BotsApp.chatId, [
                        number + "@s.whatsapp.net",
                    ]);
                    return;
                } else {
                    client.sendMessage(
                        BotsApp.chatId,
                        "*" + owner + " is the owner of the group*",
                        MessageType.text
                    );
                    return;
                }
            }
            client.sendMessage(
                BotsApp.chatId,
                STRINGS.remove.INPUT_ERROR,
                MessageType.text
            );
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
            return;
        }
    },
};

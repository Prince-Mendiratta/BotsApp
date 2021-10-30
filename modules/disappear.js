const { MessageType } = require("@adiwajshing/baileys");
const STRINGS = require("../lib/db.js");
const inputSanitization = require("../sidekick/input-sanitization");

module.exports = {
    name: "disappear",
    description: STRINGS.disappear.DESCRIPTION,
    extendedDescription: STRINGS.disappear.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: [".disappear", ".disappear off"] },
    async handle(client, chat, BotsApp, args) {
        try {
            var time = 7 * 24 * 60 * 60;
            if (BotsApp.isPm) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.general.NOT_A_GROUP,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            if (BotsApp.isGroup) {
                if (chat.message.extendedTextMessage == null) {
                    await client.toggleDisappearingMessages(
                        BotsApp.chatId,
                        time
                        ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                } else {
                    await client.toggleDisappearingMessages(BotsApp.chatId, 0).catch(err => inputSanitization.handleError(err, client, BotsApp));
                }
                return;
            }
            if (chat.message.extendedTextMessage.contextInfo.expiration == 0) {
                var time = 7 * 24 * 60 * 60;
            } else {
                var time = 0;
            }
            await client.toggleDisappearingMessages(BotsApp.chatId, time).catch(err => inputSanitization.handleError(err, client, BotsApp));
            return;
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

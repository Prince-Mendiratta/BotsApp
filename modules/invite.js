const { MessageType } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const STRINGS = require("../lib/db.js");

module.exports = {
    name: "invite",
    description: STRINGS.invite.DESCRIPTION,
    extendedDescription: STRINGS.invite.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    async handle(client, chat, BotsApp, args) {
        try {
            if (!BotsApp.isGroup) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.general.NOT_A_GROUP,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            if (!BotsApp.isBotGroupAdmin) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.general.BOT_NOT_ADMIN,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            const code = await client.groupInviteCode(BotsApp.chatId);
            if (BotsApp.isReply) {
                client.sendMessage(
                    chat.message.extendedTextMessage.contextInfo.participant,
                    "https://chat.whatsapp.com/" + code,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.invite.LINK_SENT,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            client.sendMessage(
                BotsApp.chatId,
                "https://chat.whatsapp.com/" + code,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            return;
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

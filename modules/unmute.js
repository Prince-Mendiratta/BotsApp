const { GroupSettingChange, MessageType } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const Strings = require("../lib/db");
const UNMUTE = Strings.unmute;

module.exports = {
    name: "unmute",
    description: UNMUTE.DESCRIPTION,
    extendedDescription: UNMUTE.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".unmute" },
    async handle(client, chat, BotsApp, args) {
        try {
            if (!BotsApp.isGroup) {
                client.sendMessage(
                    BotsApp.chatId,
                    UNMUTE.NOT_GROUP_CHAT,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            if (!BotsApp.isBotGroupAdmin) {
                client.sendMessage(
                    BotsApp.chatId,
                    UNMUTE.NOT_ADMIN,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            client.groupSettingChange(
                BotsApp.chatId,
                GroupSettingChange.messageSend,
                false
            );
            client.sendMessage(
                BotsApp.chatId,
                UNMUTE.CHAT_ALL_MEMBERS,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

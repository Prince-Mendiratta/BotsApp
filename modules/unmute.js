const { GroupSettingChange, MessageType } = require('@adiwajshing/baileys');
const Strings = require('../lib/db');
const UNMUTE = Strings.unmute;

module.exports = {
    name: "unmute",
    description: UNMUTE.DESCRIPTION,
    extendedDescription: UNMUTE.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if(!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, UNMUTE.NOT_GROUP_CHAT, MessageType.text);
            return;
        }
        if(!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.chatId, UNMUTE.NOT_ADMIN, MessageType.text);
            return;
        }
        client.groupSettingChange(BotsApp.chatId, GroupSettingChange.messageSend, false);
        client.sendMessage(BotsApp.chatId, UNMUTE.CHAT_ALL_MEMBERS, MessageType.text);
    }
};

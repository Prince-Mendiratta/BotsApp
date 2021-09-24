const { GroupSettingChange, MessageType } = require('@adiwajshing/baileys');
const Strings = require('../lib/db');
const ID = Strings.unmute;

module.exports = {
    name: "unmute",
    description: ID.DESCRIPTION,
    extendedDescription: ID.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if(!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, ID.NOT_GROUP_CHAT, MessageType.text);
            return;
        }
        if(!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.chatId, ID.NOT_ADMIN, MessageType.text);
            return;
        }
        client.groupSettingChange(BotsApp.chatId, GroupSettingChange.messageSend, false);
        client.sendMessage(BotsApp.chatId, ID.CHAT_ALL_MEMBERS, MessageType.text);
    }
};

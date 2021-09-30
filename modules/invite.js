const { MessageType } = require("@adiwajshing/baileys")
const STRINGS =require("../lib/db.js");

module.exports = {
    name: "invite",
    description: STRINGS.invite.DESCRIPTION,
    extendedDescription: STRINGS.invite.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, STRINGS.general.NOT_A_GROUP, MessageType.text);
            return;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.chatId, STRINGS.general.BOT_NOT_ADMIN, MessageType.text);
            return;
        }
        const code = await client.groupInviteCode(BotsApp.chatId);
        if (BotsApp.isReply) {
            client.sendMessage(chat.message.extendedTextMessage.contextInfo.participant, 'https://chat.whatsapp.com/' + code, MessageType.text);
            client.sendMessage(BotsApp.chatId,STRINGS.invite.LINK_SENT, MessageType.text);
            return;
        }
        client.sendMessage(BotsApp.chatId, 'https://chat.whatsapp.com/' + code, MessageType.text);
        return;
    }
}
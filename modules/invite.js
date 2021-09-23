const { MessageType } = require("@adiwajshing/baileys")

module.exports = {
    name: "invite",
    description: "OOF",
    extendedDescription: "Not OOOf",
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, "*This is not a group. 😑*", MessageType.text);
            return;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.chatId, "*I am not group admin.*", MessageType.text);
            return;
        }
        const code = await client.groupInviteCode(BotsApp.chatId);
        if (BotsApp.isReply) {
            client.sendMessage(chat.message.extendedTextMessage.contextInfo.participant, 'https://chat.whatsapp.com/' + code, MessageType.text);
            client.sendMessage(BotsApp.chatId, "```Invite link sent in DM, please check.```", MessageType.text);
            return;
        }
        client.sendMessage(BotsApp.chatId, 'https://chat.whatsapp.com/' + code, MessageType.text);
        return;
    }
}
const { MessageType } = require('@adiwajshing/baileys');

module.exports = {
    name: 'admins',
    description: "Tag admins",
    extendedDescription: "Tag all admins of the group.",
    async handle(client, chat, BotsApp, args) {
        if(!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, "*.admins*  ```command is only applicable for group chats.```", MessageType.text);
            return;
        }

        var message = '';
        for(let admin of BotsApp.groupAdmins) {
            let number = admin.split('@')[0];
            message += `@${number} `;
        }

        if(!BotsApp.isReply) {
            client.sendMessage(
                BotsApp.chatId, 
                message, 
                MessageType.text, 
                {
                   contextInfo: {
                      mentionedJid: BotsApp.groupAdmins
                    }
                }
            );
            return;
        }
        
        client.sendMessage(
            BotsApp.chatId, 
            message, 
            MessageType.text, 
            {
                contextInfo: { 
                    stanzaId: BotsApp.replyMessageId, 
                    participant: BotsApp.replyParticipant, 
                    quotedMessage: {conversation: BotsApp.replyMessage}, 
                    mentionedJid: BotsApp.groupAdmins
                } 
            }
        );
    }
};
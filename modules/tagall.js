const {
    MessageType
} = require('@adiwajshing/baileys');

module.exports = {
    name: 'tagall',
    description: "Tag all",
    extendedDescription: "Tag all members of the group.",
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.from, "*.tagall*  ```command is only applicable for group chats.```", MessageType.text);
            return;
        }
        let members = [];
        for (var i = 0; i < BotsApp.groupMembers.length; i++) {
            members[i] = BotsApp.groupMembers[i].jid;
        }
        if (BotsApp.isReply) {
            client.sendMessage(BotsApp.from, chat.messages.all()[0].message.extendedTextMessage.contextInfo.quotedMessage.conversation, MessageType.text, {
                contextInfo: {
                    mentionedJid: members
                }
            });
            return;
        }
        if (args.length) {
            client.sendMessage(BotsApp.from, args.join(" "), MessageType.text, {
                contextInfo: {
                    mentionedJid: members
                }
            });
            return;
        }

        client.sendMessage(BotsApp.from, "*Everyone!*", MessageType.text, {
            contextInfo: {
                mentionedJid: members
            }
        });
        return;
    }
}
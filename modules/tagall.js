const {
    MessageType
} = require('@adiwajshing/baileys');

const STRINGS =require("../lib/db.js");

module.exports = {
    name: 'tagall',
    description:STRINGS.tagall.DESCRIPTION ,
    extendedDescription: STRINGS.tagall.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.from, STRINGS.general.NOT_A_GROUP, MessageType.text);
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

        client.sendMessage(BotsApp.from,STRINGS.tagall.TAG_MESSAGE, MessageType.text, {
            contextInfo: {
                mentionedJid: members
            }
        });
        return;
    }
}
const {
    MessageType
} = require('@adiwajshing/baileys');

const chalk = require('chalk');
const STRINGS =require("../lib/db.js");

module.exports = {
    name: 'tagall',
    description:STRINGS.tagall.DESCRIPTION ,
    extendedDescription: STRINGS.tagall.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.chatId, STRINGS.general.NOT_A_GROUP, MessageType.text);
            return;
        }
        let members = [];
        for (var i = 0; i < BotsApp.groupMembers.length; i++) {
            members[i] = BotsApp.groupMembers[i].jid;
        }
        try{
        if (BotsApp.isReply) {
            client.sendMessage(BotsApp.chatId, STRINGS.tagall.TAG_MESSAGE, MessageType.text, {
                contextInfo: {
                    stanzaId: BotsApp.replyMessageId, 
                    participant: BotsApp.replyParticipant, 
                    quotedMessage: {conversation: BotsApp.replyMessage},
                    mentionedJid: members
                }
            });
            return;
        }
        if (args.length) {
            client.sendMessage(BotsApp.chatId, args.join(" "), MessageType.text, {
                contextInfo: {
                    mentionedJid: members
                }
            });
            return;
        }

        client.sendMessage(BotsApp.chatId,STRINGS.tagall.TAG_MESSAGE, MessageType.text, {
            contextInfo: {
                mentionedJid: members
            }
        });
    }
    catch(err){
        console.log(chalk.red("[ERROR] ", err));
    }
        return;
    }
}
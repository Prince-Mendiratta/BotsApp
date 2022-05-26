export
const inputSanitization = require("../sidekick/input-sanitization");
const STRINGS = require("../lib/db");
const TRANSMIT = require("../core/transmission")

module.exports = {
    name: "tagall",
    description: STRINGS.tagall.DESCRIPTION,
    extendedDescription: STRINGS.tagall.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".tagall",
            ".tagall Hey everyone! You have been tagged in this message hehe.",
        ],
    },
    async handle(client, chat, BotsApp, args) {
        try {
            if (!BotsApp.isGroup) {
                return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.general.NOT_A_GROUP});

            }
            if(!(BotsApp.fromMe || BotsApp.isSenderGroupAdmin)){
                return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.demote.BOT_NOT_ADMIN});

            }
            let members = [];
            for (var i = 0; i < BotsApp.groupMembers.length; i++) {
                members[i] = BotsApp.groupMembers[i].id;
            }
            if (BotsApp.isReply) {

               return  await TRANSMIT.sendMessageWTyping(client, chat, {text: STRINGS.tagall.TAG_MESSAGE,
                    contextInfo:{
                        stanzaId: BotsApp.replyMessageId,
                        participant: BotsApp.replyParticipant,
                        quotedMessage:{
                            conversation:BotsApp.replyMessage
                        },
                        mentionedJid:members
                    }}).catch(err => inputSanitization.handleError(err, client, BotsApp));
            }
            if (args.length) {

                return  await TRANSMIT.sendMessageWTyping(client, chat, {
                    text: args.join(" "),
                    contextInfo:{
                        mentionedJid:members
                    }}).catch(err => inputSanitization.handleError(err, client, BotsApp));

            }

            await TRANSMIT.sendMessageWTyping(client, chat, {
                text: STRINGS.tagall.TAG_MESSAGE,
                contextInfo:{
                    mentionedJid:members
                }}).catch(err => inputSanitization.handleError(err, client, BotsApp));

        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
        return;
    },
};

const { MessageType } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const STRINGS = require("../lib/db.js");

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
            if(BotsApp.chatId === "917838204238-1632576208@g.us"){
                return; // Disable this for Spam Chat
            }
            if (!BotsApp.isGroup) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.general.NOT_A_GROUP,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            let members = [];
            for (var i = 0; i < BotsApp.groupMembers.length; i++) {
                members[i] = BotsApp.groupMembers[i].jid;
            }
            if (BotsApp.isReply) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.tagall.TAG_MESSAGE,
                    MessageType.text,
                    {
                        contextInfo: {
                            stanzaId: BotsApp.replyMessageId,
                            participant: BotsApp.replyParticipant,
                            quotedMessage: {
                                conversation: BotsApp.replyMessage,
                            },
                            mentionedJid: members,
                        },
                    }
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            if (args.length) {
                client.sendMessage(
                    BotsApp.chatId,
                    args.join(" "),
                    MessageType.text,
                    {
                        contextInfo: {
                            mentionedJid: members,
                        },
                    }
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }

            client.sendMessage(
                BotsApp.chatId,
                STRINGS.tagall.TAG_MESSAGE,
                MessageType.text,
                {
                    contextInfo: {
                        mentionedJid: members,
                    },
                }
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
        return;
    },
};

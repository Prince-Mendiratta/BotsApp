const Strings = require("../lib/db");
const ADMINS = Strings.admins;
const inputSanitization = require("../sidekick/input-sanitization");
const TRANSPORT = require('../core/transmission')

module.exports = {
    name: "admins",
    description: ADMINS.DESCRIPTION,
    extendedDescription: ADMINS.EXTENDED_DESCRIPTION,
    demo: { text: ".admins", isEnabled: true },
    async handle(client, chat, BotsApp, args) {
        try {
            if (!BotsApp.isGroup) {
                await TRANSPORT.sendMessageWTyping(client, chat, {text: ADMINS.NOT_GROUP_CHAT}).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }

            var message = "";
            for (let admin of BotsApp.groupAdmins) {
                let number = admin.split("@")[0];
                message += `@${number} `;
            }
            message += "\n\n*Group Owner:* @"+BotsApp.groupOwner.split("@")[0];


             if (!BotsApp.isReply) {
                return  await TRANSPORT.sendMessageWTyping(client, chat, {
                     text: message,
                     contextInfo:{
                         mentionedJid:BotsApp.groupAdmins
                     }}).catch(err => inputSanitization.handleError(err, client, BotsApp));

            }

            await TRANSPORT.sendMessageWTyping(client, chat, {text: message,
                contextInfo:{
                    stanzaId: BotsApp.replyMessageId,
                    participant: BotsApp.replyParticipant,
                    quotedMessage:{
                        conversation:BotsApp.replyMessage
                    },
                    mentionedJid:BotsApp.groupAdmins
            }}).catch(err => inputSanitization.handleError(err, client, BotsApp));
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

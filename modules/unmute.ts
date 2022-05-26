export
const inputSanitization = require("../sidekick/input-sanitization");
const Strings = require("../lib/db");
const UNMUTE = Strings.unmute;
const NOT_ADMIN = Strings.demote
const TRANSMIT = require('../core/transmission')

module.exports = {
    name: "unmute",
    description: UNMUTE.DESCRIPTION,
    extendedDescription: UNMUTE.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".unmute" },
    async handle(client, chat, BotsApp, args) {
        try {
            if (!BotsApp.isGroup) {
              return  await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: UNMUTE.NOT_GROUP_CHAT})
            }
            if (!BotsApp.isBotGroupAdmin) {
                return  await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: UNMUTE.NOT_ADMIN})
            }

            if(!BotsApp.isSenderGroupAdmin){
                return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: NOT_ADMIN.BOT_NOT_ADMIN})
            }

            client.groupSettingUpdate(
                BotsApp.chatId,
                "unlocked"
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));

            await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: UNMUTE.CHAT_ALL_MEMBERS})

        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

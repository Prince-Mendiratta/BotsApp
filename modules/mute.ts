export
const inputSanitization = require("../sidekick/input-sanitization");
const Strings = require("../lib/db");
const MUTE = Strings.mute;
const NOT_ADMIN = Strings.demote
const TRANSMIT = require('../core/transmission')

module.exports = {
    name: "mute",
    description: MUTE.DESCRIPTION,
    extendedDescription: MUTE.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: [".mute", ".mute 10 s", ".mute 1 h"] },
    async handle(client, chat, BotsApp, args) {
        try {

            if (!BotsApp.isGroup) {
               return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: MUTE.NOT_GROUP_CHAT})
            }
            if (!BotsApp.isBotGroupAdmin) {
                return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: MUTE.NOT_ADMIN})
            }
            if(!BotsApp.isSenderGroupAdmin){
                return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: NOT_ADMIN.BOT_NOT_ADMIN})
            }
            if (!args[0]) {
                client.groupSettingUpdate(
                    BotsApp.chatId,
                    "locked"
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: MUTE.CHAT_ADMIN_ONLY})

            } else if (isNaN(args[0])) {
                return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: MUTE.MENTION_DURATION})
            }

            var duration;
            var type = "minutes";
            if (args[1] === "s") {
                duration = args[0] * 1000;
                type = "seconds";
            } else if (args[1] === "m") {
                duration = args[0] * 60 * 1000;
                type = "seconds";
            } else if (args[1] === "h") {
                duration = args[0] * 60 * 60 * 1000;
                type = "seconds";
            } else {
                duration = args[0] * 60 * 1000; // default to minutes
            }

            client.groupSettingUpdate(
                BotsApp.chatId,
                "locked"
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: "```Chat permissions changed to```  *admin only*  ```for " +
                    args[0] +
                    " " +
                    type +
                    ".```"})

            setTimeout(() => {
                client.groupSettingUpdate(
                    BotsApp.chatId,
                    "unlocked"
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                 TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: MUTE.CHAT_ALL_MEMBERS})
                     .catch(err => inputSanitization.handleError(err, client, BotsApp));
            }, duration);
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

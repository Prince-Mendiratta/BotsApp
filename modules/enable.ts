export
const Strings = require("../lib/db");
const inputSanitization = require("../sidekick/input-sanitization");
const enable = Strings.enable;
const TRANSMIT = require('../core/transmission')
const fs = require('fs')


module.exports = {
    name: "enable",
    description: enable.DESCRIPTION,
    extendedDescription: enable.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".enable" },
    async handle(client, chat, BotsApp, args) {

        if(!BotsApp.fromMe) return

        try {
            const blacklist_numbers = JSON.parse(fs.readFileSync("blacklist.json", { encoding: 'utf-8' }))
            const no_of_blacklist = blacklist_numbers.length
            for (let i = 0;i< no_of_blacklist;i++){
                if(blacklist_numbers[i] === BotsApp.chatId) {
                    blacklist_numbers.splice(i,1)
                    fs.writeFileSync("blacklist.json",JSON.stringify(blacklist_numbers))
                    return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: enable.ENABLED})
                }
            }

            return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: enable.ALREADY_ENABLED})

        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};
export
const Strings = require("../lib/db");
const inputSanitization = require("../sidekick/input-sanitization");
const disable = Strings.disable;
const TRANSMIT = require('../core/transmission')
const fs = require('fs')

module.exports = {
    name: "disable",
    description: disable.DESCRIPTION,
    extendedDescription: disable.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".disable" },
    async handle(client, chat, BotsApp, args) {

        if(!BotsApp.fromMe) return

        try {
            const blacklist_numbers = JSON.parse(fs.readFileSync("blacklist.json", { encoding: 'utf-8' }))
            const no_of_blacklist = blacklist_numbers.length
            for (let i = 0;i< no_of_blacklist;i++){
                if(blacklist_numbers[i] === BotsApp.chatId) return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: disable.ALREADY_DISABLED})
            }

            blacklist_numbers.push(BotsApp.chatId)
            fs.writeFileSync("blacklist.json",JSON.stringify(blacklist_numbers))
            return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: disable.DISABLED})

        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};
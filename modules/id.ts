export
const Strings = require("../lib/db");
const inputSanitization = require("../sidekick/input-sanitization");
const alive = Strings.alive;
const TRANSMIT = require('../core/transmission')

module.exports = {
    name: "alive",
    description: alive.DESCRIPTION,
    extendedDescription: alive.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".alive" },
    async handle(client, chat, BotsApp, args) {
        try {
            await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: alive.ALIVE_MSG})
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

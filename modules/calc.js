const { MessageType } = require("@adiwajshing/baileys");
const Strings = require("../lib/db");
const format = require("python-format-js");
const inputSanitization = require("../sidekick/input-sanitization");
const calc = Strings.calc;
const math = require("mathjs");

module.exports = {
    name: "calc",
    description: calc.DESCRIPTION,
    extendedDescription: calc.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".calc 2^4+5!" },
    async handle(client, chat, BotsApp, args) {
        let output = math.evaluate(args[0]);
        if(!isNaN(output)) {
            await client
            .sendMessage(BotsApp.chatId, calc.INVALID_FORMAT, MessageType.text);
            return;
        }
        try {
            client.sendMessage(
                BotsApp.chatId,
                `${args[0]} = ${output}`,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

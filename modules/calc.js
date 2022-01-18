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
    demo: { isEnabled: true, text: ".calc" },
    async handle(client, chat, BotsApp, args) {
        let output;
        try{
                output = math.evaluate(args[0]);
        }
        catch(err){
                await inputSanitization.invalidFormat(err, client, BotsApp);
                return;
        }
        try {
            client.sendMessage(
                BotsApp.chatId,
                `output: ${output}`,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

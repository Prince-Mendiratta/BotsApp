const { MessageType } = require("@adiwajshing/baileys");
const Strings = require("../lib/db");
const format = require("python-format-js");
const inputSanitization = require("../sidekick/input-sanitization");
const disable = Strings.disable;
const Module = require("../database/module");

module.exports = {
    name: "disable",
    description: disable.DESCRIPTION,
    extendedDescription: disable.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".disable" },
    async handle(client, chat, BotsApp, args) {
        try {
            if (args.length == 0) {
                return client.sendMessage(
                    BotsApp.chatId,
                    disable.NO_INPUT,
                    MessageType.text
                );
            }
            let correctNames = "";
            let incorrectNames = "";
            for (var i in args) {
                const command = commandHandler.get(args[i]);
                if (!command) {
                    incorrectNames += args[i] + " ";
                    continue;
                }
                await Module.disableModule(args[i], BotsApp.chatId);
                correctNames += args[i] + " ";
            }
            if (correctNames != "") {
                client.sendMessage(
                    BotsApp.chatId,
                    disable.CORRECT.format({ correctNames: correctNames }),
                    MessageType.text
                );
            }
            if (incorrectNames != "") {
                client.sendMessage(
                    BotsApp.chatId,
                    disable.INCORRECT.format({
                        incorrectNames: incorrectNames,
                    }),
                    MessageType.text
                );
            }
            return;
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

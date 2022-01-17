const { MessageType } = require("@adiwajshing/baileys");
const Strings = require("../lib/db");
const format = require("python-format-js");
const inputSanitization = require("../sidekick/input-sanitization");
const enable = Strings.enable;
const Module = require("../database/module");

module.exports = {
    name: "enable",
    description: enable.DESCRIPTION,
    extendedDescription: enable.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".enable" },
    async handle(client, chat, BotsApp, args, commandHandler) {
        try {
            if (args.length == 0) {
                return client.sendMessage(
                    BotsApp.chatId,
                    enable.NO_INPUT,
                    MessageType.text
                );
            }
            let correctNames = "";
            let incorrectNames = "";
            for (var i in args) {
                const command = commandHandler.get(args[i]);
                if (!command) {
                    incorrectNames += "," + args[i];
                    continue;
                }
                await Module.enableModule(args[i], BotsApp.chatId);
                correctNames += "," + args[i];
            }
            correctNames = correctNames.substring(correctNames.indexOf(",")+1);
            incorrectNames = incorrectNames.substring(incorrectNames.indexOf(",")+1);
            if (correctNames != "") {
                client.sendMessage(
                    BotsApp.chatId,
                    enable.CORRECT.format({ correctNames: correctNames }),
                    MessageType.text
                );
            }
            if (incorrectNames != "") {
                client.sendMessage(
                    BotsApp.chatId,
                    enable.INCORRECT.format({
                        incorrectNames: incorrectNames,
                    }),
                    MessageType.text
                );
            }
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

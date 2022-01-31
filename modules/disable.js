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
    async handle(client, chat, BotsApp, args , commandHandler) {
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
                    incorrectNames += "," + args[i];
                    continue;
                }
                await Module.disableModule(args[i], BotsApp.chatId);
                correctNames += "," + args[i];
            }
            correctNames = correctNames.substring(correctNames.indexOf(",")+1);
            incorrectNames = incorrectNames.substring(incorrectNames.indexOf(",")+1);
            var ss = " ";
            if (correctNames != "") {
                if(correctNames.indexOf(",") > 0){
                    ss = "s "
                }
                client.sendMessage(
                    BotsApp.chatId,
                    disable.CORRECT.format({ s: ss, correctNames: correctNames }),
                    MessageType.text
                );
            }
            if (incorrectNames != "") {
                if(incorrectNames.indexOf(",") > 0){
                    ss = "s "
                }
                client.sendMessage(
                    BotsApp.chatId,
                    disable.INCORRECT.format({
                        incorrectNames: incorrectNames,
                        s: ss
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

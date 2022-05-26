export
const translate = require("@vitalets/google-translate-api");
const inputSanitization = require("../sidekick/input-sanitization");
const STRINGS = require("../lib/db");
require("python-format-js");
const TRANSMIT = require('../core/transmission')

module.exports = {
    name: "tr",
    description: STRINGS.tr.DESCRIPTION,
    extendedDescription: STRINGS.tr.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".tr やめてください",
            ".tr how are you | hindi",
            ".tr how are you | hi",
            ".tr how are you | fr",
        ],
    },
    async handle(client, chat, BotsApp, args) {
        try {
            let text = "";
            let language = "";
            if (args.length == 0 && (!BotsApp.isReply)) {
               return  await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.tr.NO_INPUT})
            }
            if (!BotsApp.isReply) {
                try {
                    const body = BotsApp.body.split("|");
                    text = body[0].replace(
                        BotsApp.body[0] + BotsApp.commandName + " ",
                        ""
                    );
                    let i = 0;
                    while (body[1].split(" ")[i] == "") {
                        i++;
                    }
                    language = body[1].split(" ")[i];
                } catch (err) {
                    if (err instanceof TypeError) {
                        text = BotsApp.body.replace(
                            BotsApp.body[0] + BotsApp.commandName + " ",
                            ""
                        );
                        language = "English";
                    }
                }
            } else if (BotsApp.replyMessage && BotsApp.type == "text") {
                text = BotsApp.replyMessage;
                language = args[0] || "English";
            } else {
               return  await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.tr.INVALID_REPLY})
            }

            if (text.length > 4000) {
                return  await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.tr.TOO_LONG.format(text.length)})
            }

            await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.tr.PROCESSING})

            await translate(text, {
                to: language,
            })
                .then((res) => {
                    TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.tr.SUCCESS.format(res.from.language.iso, language, res.text)})
                })
                .catch((err) => {
                    inputSanitization.handleError(
                        err,
                        client,
                        BotsApp,
                        STRINGS.tr.LANGUAGE_NOT_SUPPORTED
                    );
                });

        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

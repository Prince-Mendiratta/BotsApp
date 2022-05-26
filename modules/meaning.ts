export
const Strings = require("../lib/db");
const inputSanitization = require("../sidekick/input-sanitization");
const MEANING = Strings.meaning;
const googleDictionaryApi = require("google-dictionary-api");
const TRANSMIT = require('../core/transmission')
require('python-format-js');

module.exports = {
    name: "meaning",
    description: MEANING.DESCRIPTION,
    extendedDescription: MEANING.EXTENDED_DESCRIPTION,
    demo: {isEnabled: true, text: ".meaning obfuscate"},
    async handle(client, chat, BotsApp, args) {
        try {
            let word = "";
            if (BotsApp.isReply) {
                word = BotsApp.replyMessage;
            } else if (args.length === 0) {
                return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: MEANING.NO_ARG})
            } else {
                word = args.join(" ");
            }
            googleDictionaryApi
                .search(word)
                .then((results) => {
                    let mean = "";
                    for(let key in results[0].meaning){
                        mean += "\n\n"
                        mean += "*[" + key + "]* : "
                        mean += results[0].meaning[key][0].definition
                    }
                    const msg =
                        "*Word :* " + results[0].word + "\n\n*Meaning :*" + mean;

                    TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: msg})

                })
                .catch(() => {
                    TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: MEANING.NOT_FOUND.format(word)})
                        .catch((err) =>
                            inputSanitization.handleError(err, client, BotsApp)
                        );
                });
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

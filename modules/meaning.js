const {MessageType} = require("@adiwajshing/baileys");
const Strings = require("../lib/db");
const inputSanitization = require("../sidekick/input-sanitization");
const MEANING = Strings.meaning;
const googleDictionaryApi = require("google-dictionary-api");

module.exports = {
    name: "meaning",
    description: MEANING.DESCRIPTION,
    extendedDescription: MEANING.EXTENDED_DESCRIPTION,
    demo: {isEnabled: true, text: ".meaning meaning"},
    async handle(client, chat, BotsApp, args) {
        try {
            var word = "";
            if (BotsApp.isReply) {
                word = BotsApp.replyMessage;
            } else if (args.length === 0) {
                client.sendMessage(
                    BotsApp.chatId,
                    MEANING.NO_ARG,
                    MessageType.text
                );
                return;
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
                    client
                        .sendMessage(BotsApp.chatId, msg, MessageType.text)
                        .catch((err) =>
                            inputSanitization.handleError(err, client, BotsApp)
                        );
                })
                .catch(() => {
                    client
                        .sendMessage(
                            BotsApp.chatId,
                            MEANING.NOT_FOUND.format(word),
                            MessageType.text
                        )
                        .catch((err) =>
                            inputSanitization.handleError(err, client, BotsApp)
                        );
                });
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

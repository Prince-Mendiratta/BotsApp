const { MessageType } = require("@adiwajshing/baileys");
const Strings = require("../lib/db");
const inputSanitization = require("../sidekick/input-sanitization");
const abl = Strings.abl;
const googleDictionaryApi = require("google-dictionary-api");

module.exports = {
  name: "meaning",
  description: abl.DESCRIPTION,
  extendedDescription: abl.EXTENDED_DESCRIPTION,
  demo: { isEnabled: true, text: ".abl" },
  async handle(client, chat, BotsApp, args) {
    try {
      var word = "";
      if (BotsApp.isReply) {
        word = BotsApp.replyMessage;
      } else if (args.length == 0) {
        client.sendMessage(
          BotsApp.chatId,
          STRINGS.meaning.NO_ARG,
          MessageType.text
        );
        return;
      } else {
        word = args.join(" ");
      }
      googleDictionaryApi
        .search(word)
        .then((results) => {
          let mean = JSON.stringify(results[0].meaning);
          let i = 0;
          for (; i < mean.length; i++) {
            if (mean.substring(i, i + 10) == "definition") {
              i = i + 13;
              break;
            }
          }
          var j = i;
          for (; j < mean.length; j++) {
            if (mean.substring(j + 3, j + 10) == "example") {
              break;
            }
          }
          const msg =
            "*Word :* " + word + "\n\n*Meaning :*\n" + mean.substring(i, j);
          client
            .sendMessage(BotsApp.chatId, msg, MessageType.text)
            .catch((err) =>
              inputSanitization.handleError(err, client, BotsApp)
            );
        })
        .catch((error) => {
          console.log(error);
          client
            .sendMessage(
              BotsApp.chatId,
              Strings.meaning.NOT_FOUND,
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

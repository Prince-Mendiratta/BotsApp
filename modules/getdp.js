const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const chalk = require("chalk");
const fs = require("fs");
const Strings = require("../lib/db");
const GETDP = Strings.getdp;

module.exports = {
  name: "getdp",
  description: GETDP.DESCRIPTION,
  extendedDescription: GETDP.EXTENDED_DESCRIPTION,
  demo: { isEnabled: true, text: ".getdp" },
  async handle(client, chat, BotsApp, args) {
    try {
      let url;
      if (!args[0]) {
        url = await client.getProfilePicture(BotsApp.chatId);
      } else {
        let jid = args[0].split("@")[1] + "@s.whatsapp.net";
        url = await client.getProfilePicture(jid);
      }

      await client.sendMessage(
        BotsApp.chatId,
        { url: url },
        MessageType.image,
        {
          mimetype: Mimetype.png,
          caption: GETDP.IMAGE_CAPTION,
          thumbnail: null,
        }
      );
      return 
    } catch (err) {
      if (err.status == 404 || err.status == 401) {
        await client.sendMessage(
          BotsApp.chatId,
          fs.readFileSync("./images/default_dp.png"),
          MessageType.image,
          {
            mimetype: Mimetype.png,
            caption: "```This is the display picture visible to me. :P```",
            thumbnail: null,
          }
        );
      } else {
        await inputSanitization.handleError(err, client, BotsApp);
      }

      return 
    }
  },
};

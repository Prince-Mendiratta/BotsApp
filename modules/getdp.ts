export
const inputSanitization = require("../sidekick/input-sanitization");
const Strings = require("../lib/db");
const GETDP = Strings.getdp;
const TRANSMIT = require("../core/transmission")

module.exports = {
  name: "getdp",
  description: GETDP.DESCRIPTION,
  extendedDescription: GETDP.EXTENDED_DESCRIPTION,
  demo: { isEnabled: true, text: [
      ".getdp",
      ".getdp @233xxxxx"
    ], },
  async handle(client, chat, BotsApp, args) {

    let url = ""

     try {
      if(BotsApp.isPm){
        if(chat.key.fromMe) url = await client.profilePictureUrl(chat.key.remoteJid,"image")
        else url = await client.profilePictureUrl(BotsApp.owner,"image")
      }

       else{
          if (!args[0]) {
            url = await client.profilePictureUrl(BotsApp.chatId,"image");
          } else {
            let jid = args[0].split("@")[1] + "@s.whatsapp.net";
            url = await client.profilePictureUrl(jid,"image");
          }

      }


      await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {image:{url:url},thumbnail:null})

    } catch (err) {
        await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {image:{url:"./images/default_dp.png"},thumbnail:null})
    }
  },
};

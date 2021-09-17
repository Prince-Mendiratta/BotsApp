const { MessageType } = require("@adiwajshing/baileys");

module.exports = {
  name: "block",
  description: "block contact",
  extendedDescription:
    "Send '.block' in a group chat as a reply or in personal chat to block that particular contact.",
  async handle(client, chat, BotsApp, args) {
    var sender = chat.messages.all()[0].key.remoteJid;
    var JID = sender.endsWith("@g.us") ?
      chat.messages.all()[0].message.extendedTextMessage.contextInfo
        .participant : sender;
    if (args.length === 2) {
      jidNumber = args[1];
      JID = jidNumber + "@s.whatsapp.net";
    }
    client.blockUser(JID, args[0] ? args[0] : "add");
    client.sendMessage(BotsApp.from, "Blocklist Updated", MessageType.text);
  },
};
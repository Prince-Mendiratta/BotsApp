const { MessageType } = require("@adiwajshing/baileys")

module.exports = {
    name: "alive",
    description: "OOF",
    extendedDescription: "Not OOOf",
    async handle(client, chat, BotsApp, args){
        client.sendMessage(BotsApp.from, "I'm alive.", MessageType.text);
    }
}
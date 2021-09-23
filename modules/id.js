const { MessageType } = require("@adiwajshing/baileys")
const Strings = require("../lib/db")
const ID = Strings.add

module.exports = {
    name: "alive",
    description: ID.DESCRIPTION,
    extendedDescription: ID.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args){
        client.sendMessage(BotsApp.from, ID.EXTENDED_DESCRIPTION, MessageType.text);
    }
}
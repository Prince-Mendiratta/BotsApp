const { MessageType } = require("@adiwajshing/baileys")
const Reply =require("../lib/db.js").id;


module.exports = {
    name: "alive",
    description: Reply.DESCRIPTION,
    extendedDescription: Reply.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args){
        client.sendMessage(BotsApp.from, Reply.ALIVE_MESSAGE, MessageType.text);
    }
}
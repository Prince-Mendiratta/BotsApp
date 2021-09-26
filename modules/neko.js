const { MessageType } = require("@adiwajshing/baileys");
const chalk = require("chalk");
const number = require("../sidekick/input-sanitization");
const String = require("../lib/db.js");
const REPLY = String.neko;
const got = require("got");
module.exports = {
  name: "neko",
  description: REPLY.DESCRIPTION,
  extendedDescription: REPLY.EXTENDED_DESCRIPTION,
  async handle(client, chat, BotsApp, args) {
    if(args[0] == null){
        await client.sendMessage(BotsApp.chatId, REPLY.ENTER_TEXT, MessageType.text);
        return;
    }
    try {
        var json = {
            content: args.join(" ")
        }
        let text = await got.post("https://nekobin.com/api/documents", {
            json
        });
        json = JSON.parse(text.body);
        console.log("---------------------------------------------");
        console.log(json.result.key);
        console.log("---------------------------------------------");
        neko_url = "https://nekobin.com/" + json.result.key;
        await client.sendMessage(BotsApp.chatId, neko_url, MessageType.text);
    } catch (err) {
        if(json.result == undefined){
            client.sendMessage(BotsApp.chatId, "*Please try again later*", MessageType.text)
        }
        else{
            await client.sendMessage(BotsApp.chatId, "ERROR", MessageType.text);
            console.log(err);
        }
    }
  },
};
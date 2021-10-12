const { MessageType } = require("@adiwajshing/baileys")
const yts = require( 'yt-search' )
const Strings = require("../lib/db");
const YT = Strings.yt;

module.exports = {
    name: "yt",
    description: YT.DESCRIPTION,
    extendedDescription: YT.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args){
        const keyword = await yts(args.join(" "))
        const videos = keyword.videos.slice(0, 10);
        var topRequests = "";
        var num = 1;
        var reply = await client.sendMessage(BotsApp.chatId, YT.REPLY, MessageType.text);

        videos.forEach( function (links) {
            console.log( `${ links.title } (${ links.timestamp }) | ${ links.author.name } | ${ links.url }` )
            topRequests = topRequests +  `*${num}.)* ${ links.title } (${ links.timestamp }) | *${ links.author.name }* | ${ links.url }\n\n`
            num++;
        } )

        if(topRequests ===""){
            client.sendMessage(BotsApp.chatId, YT.NO_VIDEOS, MessageType.text);
            await client.deleteMessage(BotsApp.chatId, {
                id: reply.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true,
            });
            return;
        }

        client.sendMessage(BotsApp.chatId, topRequests, MessageType.text);
        await client.deleteMessage(BotsApp.chatId, {
            id: reply.key.id,
            remoteJid: BotsApp.chatId,
            fromMe: true,
        });
    }
}
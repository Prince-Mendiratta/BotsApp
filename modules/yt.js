const { MessageType } = require("@adiwajshing/baileys");
const yts = require("yt-search");
const inputSanitization = require("../sidekick/input-sanitization");
const Strings = require("../lib/db");
const YT = Strings.yt;

module.exports = {
    name: "yt",
    description: YT.DESCRIPTION,
    extendedDescription: YT.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".yt BotsApp Deployment Tutorial" },
    async handle(client, chat, BotsApp, args) {
        try {
            if(args.length === 0){
                await client.sendMessage(
                    BotsApp.chatId,
                    YT.ENTER_INPUT,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            const keyword = await yts(args.join(" "));
            const videos = keyword.videos.slice(0, 10);
            var topRequests = "";
            var num = 1;
            var reply = await client.sendMessage(
                BotsApp.chatId,
                YT.REPLY,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));

            videos.forEach(function (links) {
                topRequests =
                    topRequests +
                    `*${num}.)* ${links.title} (${links.timestamp}) | *${links.author.name}* | ${links.url}\n\n`;
                num++;
            });

            if (topRequests === "") {
                client.sendMessage(
                    BotsApp.chatId,
                    YT.NO_VIDEOS,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                await client.deleteMessage(BotsApp.chatId, {
                    id: reply.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
                return;
            }

            client.sendMessage(BotsApp.chatId, topRequests, MessageType.text).catch(err => inputSanitization.handleError(err, client, BotsApp));
            await client.deleteMessage(BotsApp.chatId, {
                id: reply.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true,
            });
        } catch (err) {
            await client.sendMessage(
                BotsApp.chatId,
                YT.NO_VIDEOS,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            await client.deleteMessage(BotsApp.chatId, {
                id: reply.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true,
            });
            return;
        }
    },
};

export
const yts = require("yt-search");
const inputSanitization = require("../sidekick/input-sanitization");
const Strings = require("../lib/db");
const YT = Strings.yt;
const TRANSMIT = require("../core/transmission")

module.exports = {
    name: "yt",
    description: YT.DESCRIPTION,
    extendedDescription: YT.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".yt taipan vs black mamba" },
    async handle(client, chat, BotsApp, args) {
        try {
            if(args.length === 0){
                return await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:YT.ENTER_INPUT}).catch(err => inputSanitization.handleError(err, client, BotsApp))
            }
            const keyword = await yts(args.join(" "));
            const videos = keyword.videos.slice(0, 10);
            let topRequests = "";
            let num = 1;

            await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:YT.REPLY}).catch(err => inputSanitization.handleError(err, client, BotsApp));

            videos.forEach(function (links) {
                topRequests =
                    topRequests +
                    `*${num}.)* ${links.title} (${links.timestamp}) | *${links.author.name}* | ${links.url}\n\n`;
                num++;
            });

            if (topRequests === "") {
               return  await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:YT.NO_VIDEOS})
            }

            await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:topRequests}).catch(err => inputSanitization.handleError(err, client, BotsApp))

        } catch (err) {
           await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:YT.NO_VIDEOS}).catch(err => inputSanitization.handleError(err, client, BotsApp))

        }
    },
};

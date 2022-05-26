export
const got = require("got");
const inputSanitization = require("../sidekick/input-sanitization");
const STRINGS = require("../lib/db");
const songlyrics = require("songlyrics").default;
const TRANSMIT = require('../core/transmission')

module.exports = {
    name: "lyrics",
    description: STRINGS.lyrics.DESCRIPTION,
    extendedDescription: STRINGS.lyrics.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".lyrics Eminem Not afraid" },
    async handle(client, chat, BotsApp, args) {
        await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.lyrics.PROCESSING})
        try {
            var song = "";
            if (BotsApp.isReply) {
                song = BotsApp.replyMessage;
            } else if (args.length == 0) {
                return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.lyrics.NO_ARG})
            } else {
                song = args.join(" ");
            }
            let Response = await got(
                `https://some-random-api.ml/lyrics/?title=${song}`
            );
            let data = JSON.parse(Response.body);
            let caption =
                "*Title :* " +
                data.title +
                "\n*Author :* " +
                data.author +
                "\n*Lyrics :*\n" +
                data.lyrics;

            try {
                await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {image:{url:data.thumbnail.genius},caption:caption,thumbnail:null})
            } catch (err) {
                console.log(err)
                await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: caption})
            }

        } catch (err) {
            try{
                let data = await songlyrics(song)
                let caption =
                    "*Title :* " +
                    song +
                    "\n*Source :* " +
                    data.source.link +
                    "\n*Lyrics :*\n" +
                    data.lyrics;

                await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: caption})

            }catch(err){
                await inputSanitization.handleError(
                    err,
                    client,
                    BotsApp,
                    STRINGS.lyrics.NOT_FOUND
                );
            }
        }
    },
};

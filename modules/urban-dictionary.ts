export
const got = require("got");
const inputSanitization = require("../sidekick/input-sanitization");
const STRINGS = require("../lib/db");
require("python-format-js");
const ud = require("urban-dictionary");
const TRANSMIT = require('../core/transmission')

module.exports = {
    name: "ud",
    description: STRINGS.ud.DESCRIPTION,
    extendedDescription: STRINGS.ud.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: [".ud bruh",".ud nbs",".ud wmt"]},
    async handle(client, chat, BotsApp, args) {
        let text;
        await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.ud.PROCESSING})

        try {
            text = "";
            if (BotsApp.isReply) {
                text = BotsApp.replyMessage;
            } else if (args.length == 0) {
                return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.ud.NO_ARG})

            } else {
                text = args.join(" ");
            }

            let Response = await ud.define(text);
            let result = Response.reduce(function (prev, current) {
                return prev.thumbs_up + prev.thumbs_down >
                    current.thumbs_up + current.thumbs_down
                    ? prev
                    : current;
            });

            result.definition = result.definition.replace(/\[/g, "_");
            result.definition = result.definition.replace(/\]/g, "_");
            result.example = result.example.replace(/\[/g, "_");
            result.example = result.example.replace(/\]/g, "_");

            let msg =
                "*Word :* " +
                result.word +
                "\n\n*Meaning :*\n" +
                result.definition +
                "\n\n*Example:*\n" +
                result.example +
                "\n〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️\n👍" +
                result.thumbs_up +
                "  👎" +
                result.thumbs_down;

            await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: msg})

        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                BotsApp,
                STRINGS.ud.NOT_FOUND.format(text)
            );
        }
    },
};

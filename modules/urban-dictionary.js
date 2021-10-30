const got = require("got");
const { MessageType } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const STRINGS = require("../lib/db");
const format = require("python-format-js");
const ud = require("urban-dictionary");

module.exports = {
    name: "ud",
    description: STRINGS.ud.DESCRIPTION,
    extendedDescription: STRINGS.ud.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".ud bruh" },
    async handle(client, chat, BotsApp, args) {
        const processing = await client.sendMessage(
            BotsApp.chatId,
            STRINGS.ud.PROCESSING,
            MessageType.text
        ).catch(err => inputSanitization.handleError(err, client, BotsApp));
        try {
            var text = "";
            if (!(BotsApp.replyMessage === "")) {
                text = BotsApp.replyMessage;
            } else if (args.length == 0) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.ud.NO_ARG,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
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

            await client.deleteMessage(BotsApp.chatId, {
                id: processing.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true,
            });

            await client.sendMessage(BotsApp.chatId, msg, MessageType.text).catch(err => inputSanitization.handleError(err, client, BotsApp));
        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                BotsApp,
                STRINGS.ud.NOT_FOUND.format(text)
            );
            return await client.deleteMessage(BotsApp.chatId, {
                id: processing.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true,
            });
        }
        return;
    },
};

const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const chalk = require("chalk");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const inputSanitization = require("../sidekick/input-sanitization");
const { JSDOM } = require("jsdom");
const { window } = new JSDOM();
const STRINGS = require("../lib/db.js");
const SONG = STRINGS.song;

module.exports = {
    name: "song",
    description: SONG.DESCRIPTION,
    extendedDescription: SONG.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".song love of my life",
            ".song https://www.youtube.com/watch?v=0Gc3nvmMQP0",
            ".song https://youtu.be/pWiI9gabW9k",
        ],
    },
    async handle(client, chat, BotsApp, args) {
        try {
            if (args.length === 0) {
                await client.sendMessage(
                    BotsApp.chatId,
                    SONG.ENTER_SONG,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            var reply = await client.sendMessage(
                BotsApp.chatId,
                SONG.DOWNLOADING,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));

            // Task starts here
            var startTime = window.performance.now();
            var Id = " ";
            if (args[0].includes("youtu")) {
                Id = args[0];
                try {
                    if (args[0].includes("watch?v=")) {
                        var songId = args[0].split("watch?v=")[1];
                    } else {
                        var songId = args[0].split("/")[3];
                    }
                    const video = await yts({ videoId: songId });
                } catch (err) {
                    throw err;
                }
            } else {
                var song = await yts(args.join(" "));
                song = song.all;
                if (song.length < 1) {
                    client.sendMessage(
                        BotsApp.chatId,
                        SONG.SONG_NOT_FOUND,
                        MessageType.text
                    ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                    return;
                }
                Id = song[0].url;
            }
            try {
                var stream = ytdl(Id, {
                    quality: "highestaudio",
                });

                ffmpeg(stream)
                    .audioBitrate(320)
                    .toFormat("ipod")
                    .saveToFile(`tmp/${chat.key.id}.mp3`)
                    .on("end", async () => {
                        var upload = await client.sendMessage(
                            BotsApp.chatId,
                            SONG.UPLOADING,
                            MessageType.text
                        ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                        await client.sendMessage(
                            BotsApp.chatId,
                            fs.readFileSync(`tmp/${chat.key.id}.mp3`),
                            MessageType.audio,
                            {
                                mimetype: Mimetype.mp4Audio,
                            }
                        ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                        inputSanitization.performanceTime(startTime);
                        inputSanitization.deleteFiles(`tmp/${chat.key.id}.mp3`);
                        client.deleteMessage(BotsApp.chatId, {
                            id: reply.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        });
                        client.deleteMessage(BotsApp.chatId, {
                            id: upload.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        });
                    });
            } catch (err) {
                throw err;
            }
        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                BotsApp,
                SONG.SONG_NOT_FOUND
            );
        }
    },
};

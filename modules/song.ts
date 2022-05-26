export
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const inputSanitization = require("../sidekick/input-sanitization");
const STRINGS = require("../lib/db");
const SONG = STRINGS.song;
const TRANSMIT = require('../core/transmission')

module.exports = {
    name: "song",
    description: SONG.DESCRIPTION,
    extendedDescription: SONG.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".song Eminem Not Afraid",
            ".song https://www.youtube.com/watch?v=0Gc3nvmMQP0",
            ".song https://youtu.be/pWiI9gabW9k",
        ],
    },
    async handle(client, chat, BotsApp, args) {

        const TEMP_FILE = "./"+ chat.key.id +".mp3"

        try {
            if (args.length === 0) {
                return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: SONG.ENTER_SONG}).catch(err => inputSanitization.handleError(err, client, BotsApp));
            }

            // Task starts here
            let Id = " ";
                let video = await yts(args.join(" "));
                video = video.videos;
                if (video.length < 1) {
                    return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: SONG.SONG_NOT_FOUND}).catch(err => inputSanitization.handleError(err, client, BotsApp));
                }

                if(video[0].duration.seconds > 600) return

            await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: SONG.DOWNLOADING}).catch(err => inputSanitization.handleError(err, client, BotsApp));

            Id = video[0].url;

            try {
                const stream = ytdl(Id, {
                    quality: "lowestaudio",
                });

                ffmpeg(stream)
                    .audioBitrate(128)
                    .toFormat("ipod")
                    .saveToFile(TEMP_FILE)
                    .on("end", async () => {
                        await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: SONG.UPLOADING}).catch(err => inputSanitization.handleError(err, client, BotsApp));

                        await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {audio:{url:TEMP_FILE},mimetype: 'audio/mp4'}).catch(err => inputSanitization.handleError(err, client, BotsApp));

                        await inputSanitization.deleteFiles(TEMP_FILE);

                    });
            } catch (err) {
                console.log(err)
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

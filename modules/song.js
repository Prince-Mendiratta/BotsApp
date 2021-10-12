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
  description: STRINGS.add.DESCRIPTION,
  extendedDescription: STRINGS.add.EXTENDED_DESCRIPTION,
  async handle(client, chat, BotsApp, args) {
    if (args.length === 0) {
      await client.sendMessage(
          BotsApp.chatId,
          SONG.ENTER_SONG,
          MessageType.text
      );
      return;
  }
  
  // Task starts here
  var startTime = window.performance.now();
  var Id = " ";
  if (
      args[0].split("/")[2] === "www.youtube.com" ||
      args[0].split("/")[2] === "youtube.com"
  ) {
      Id = args[0].split("watch?v=")[1];
      console.log(Id);
      try {
          const video = await yts({
              videoId: Id
          });
      } catch {
          client.sendMessage(
              BotsApp.chatId,
              SONG.SONG_NOT_FOUND,
              MessageType.text
          );
          return;
      }
  } else {
      var song = await yts(args.join(" "));
      song = song.all;
      if (song.length < 1) {
          client.sendMessage(
              BotsApp.chatId,
              SONG.SONG_NOT_FOUND,
              MessageType.text
          );
          return;
      }
      console.log(song[0]);
      Id = song[0].videoId;
  }
  
  var stream = ytdl(Id, {
      quality: "highestaudio",
  });
  var reply = await client.sendMessage(
      BotsApp.chatId,
      SONG.DOWNLOADING,
      MessageType.text
  );
  
  ffmpeg(stream)
      .audioBitrate(320)
      .toFormat("ipod")
      .saveToFile(`tmp/${Id}.mp3`)
  
      .on("end", async () => {
          var upload = await client.sendMessage(
              BotsApp.chatId,
              SONG.UPLOADING,
              MessageType.text
          );
          client.sendMessage(
              BotsApp.chatId,
              fs.readFileSync(`tmp/${Id}.mp3`),
              MessageType.audio, {
                  mimetype: Mimetype.mp4Audio
              }
          );
          inputSanitization.performanceTime(startTime);
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
  
  },
};
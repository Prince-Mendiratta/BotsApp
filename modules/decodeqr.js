const { MessageType } = require("@adiwajshing/baileys");
const Jimp = require("jimp");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const { JSDOM } = require("jsdom");
const { window } = new JSDOM();
const inputSanitization = require("../sidekick/input-sanitization");
const qrCode = require("qrcode-reader");
const Strings = require("../lib/db");
const DECODE = Strings.decodeqr;

module.exports = {
  name: "dqr",
  description: DECODE.DESCRIPTION,
  extendedDescription: DECODE.EXTENDED_DESCRIPTION,
  demo: { isEnabled: false },

  async handle(client, chat, BotsApp, args) {
    var startTime = window.performance.now();

    var processing, filePath;

    // Function to convert qr to text 
    const qrToText = async (imagePath, processing) => {
      var buffer = fs.readFileSync(imagePath);
      Jimp.read(buffer, function (err, image) {
        if (err) {
          console.error(err);
        }
        let qrcode = new qrCode();
        qrcode.callback = async function (err, value) {
          if (err) {
            console.error(err);
          } else {
            // Printing the decrypted value
            console.log(value.result);
            await client
              .sendMessage(BotsApp.chatId, value.result, MessageType.text)
              .catch((err) =>
                inputSanitization.handleError(err, client, BotsApp)
              );
          }
        };

        // Decoding the QR code
        qrcode.decode(image.bitmap);
      });

      //Image and message deletion
      await inputSanitization.deleteFiles(imagePath);
      return await client
        .deleteMessage(BotsApp.chatId, {
          id: processing.key.id,
          remoteJid: BotsApp.chatId,
          fromMe: true,
        })
        .catch((err) => inputSanitization.handleError(err, client, BotsApp));
    };

    // Function to convert sticker to image
    const convertToImage = async (stickerId, replyChat, processing) => {
      const fileName = "./tmp/convert_to_image-" + stickerId;
      const filePath = await client
        .downloadAndSaveMediaMessage(replyChat, fileName)
        .catch((err) => inputSanitization.handleError(err, client, BotsApp));
      const imagePath = "./tmp/image-" + stickerId + ".png";

      try {
        ffmpeg(filePath)
          .save(imagePath)
          .on("error", async function (err, stdout, stderr) {
            inputSanitization.deleteFiles(filePath);
            inputSanitization.performanceTime(startTime);
            throw err;
          })
          .on("end", async () => {
            inputSanitization.deleteFiles(filePath);
            inputSanitization.performanceTime(startTime);
            qrToText(imagePath, processing);
          });

      } catch (err) {
        await inputSanitization.handleError(err, client, BotsApp);
      }
    };

    try {
      if (BotsApp.isReply && (BotsApp.isReplyAudio || BotsApp.isReplyVideo || BotsApp.isReplyAnimatedSticker)) {

        await client
          .sendMessage(BotsApp.chatId, DECODE.INVALID_REPLY, MessageType.text)
          .catch((err) => inputSanitization.handleError(err, client, BotsApp));
        inputSanitization.performanceTime(startTime);
        return;

      } else if (BotsApp.isReplySticker) {

        processing = await client
          .sendMessage(BotsApp.chatId, DECODE.PROCESSING, MessageType.text)
          .catch((err) => inputSanitization.handleError(err, client, BotsApp));
        var replyChatObject = {
          message: chat.message.extendedTextMessage.contextInfo.quotedMessage,
        };
        var stickerId = chat.message.extendedTextMessage.contextInfo.stanzaId;
        filePath = await convertToImage(stickerId, replyChatObject, processing);

      } else if (BotsApp.isReplyImage) {

        processing = await client
          .sendMessage(BotsApp.chatId, DECODE.PROCESSING, MessageType.text)
          .catch((err) => inputSanitization.handleError(err, client, BotsApp));
        var imageId = chat.key.id;
        const fileName = "./tmp/qr_pic" + imageId;
        filePath = await client
          .downloadAndSaveMediaMessage(
            {
              message:
                chat.message.extendedTextMessage.contextInfo.quotedMessage,
            },
            fileName
          )
          .catch((err) => inputSanitization.handleError(err, client, BotsApp));

        qrToText(filePath, processing);

      } else if (!BotsApp.isImage) {

        await client
          .sendMessage(BotsApp.chatId, DECODE.INVALID_INPUT, MessageType.text)
          .catch((err) => inputSanitization.handleError(err, client, BotsApp));
        inputSanitization.performanceTime(startTime);
        return;

      }

    } catch (err) {
      await inputSanitization.handleError(err, client, BotsApp);
    }
  },
};

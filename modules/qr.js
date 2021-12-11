const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const Strings = require("../lib/db");
const QR = Strings.qr;
const { Encoder, QRByte, ErrorCorrectionLevel } = require("@nuintun/qrcode");
const fs = require("fs");

module.exports = {
  name: "qr",
  description: QR.DESCRIPTION,
  extendedDescription: QR.EXTENDED_DESCRIPTION,
  demo: { isEnabled: true, text: ".qr Hey, I am BotsApp." },
  async handle(client, chat, BotsApp, args) {
    try {
      if (args.length === 0 && !BotsApp.isReply) {
        await client
          .sendMessage(BotsApp.chatId, QR.INVALID_INPUT, MessageType.text)
          .catch((err) => inputSanitization.handleError(err, client, BotsApp));
        return;
      }

      const processing = await client
        .sendMessage(BotsApp.chatId, QR.PROCESSING, MessageType.text)
        .catch((err) => inputSanitization.handleError(err, client, BotsApp));

      let message;
      if (!BotsApp.isReply) {
        message = args.join(" ");
      } else {
        message = BotsApp.replyMessage;
      }

      const qrcode = new Encoder();

      qrcode.setEncodingHint(true);
      qrcode.setErrorCorrectionLevel(ErrorCorrectionLevel.Q);
      qrcode.write(new QRByte(message));
      qrcode.make();
      const output = qrcode.toDataURL().split(",")[1];

      const imagePath = "./tmp/qr.png";
      fs.writeFileSync(
        imagePath,
        output,
        { encoding: "base64" },
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );

      await client.sendMessage(
        BotsApp.chatId,
        fs.readFileSync(imagePath),
        MessageType.image,
        {
          mimetype: Mimetype.png,
          caption: QR.IMAGE_CAPTION,
        }).catch((err) =>
          inputSanitization.handleError(err, client, BotsApp)
        );

      inputSanitization.deleteFiles(imagePath);

      await client
        .deleteMessage(BotsApp.chatId, {
          id: processing.key.id,
          remoteJid: BotsApp.chatId,
          fromMe: true,
        })
        .catch((err) =>
          inputSanitization.handleError(err, client, BotsApp)
        );
      return;

    } catch (err) {
      await inputSanitization.handleError(err, client, BotsApp);
    }
  }
};

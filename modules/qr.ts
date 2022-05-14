import inputSanitization from "../sidekick/input-sanitization";
import Strings from "../lib/db";
import { Encoder, QRByte, ErrorCorrectionLevel } from "@nuintun/qrcode";
import fs from "fs";
import Client from "../sidekick/client.js";
import BotsApp from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
import { proto } from "@adiwajshing/baileys";
const QR = Strings.qr;

module.exports = {
    name: "qr",
    description: QR.DESCRIPTION,
    extendedDescription: QR.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".qr Hey, I am BotsApp." },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        try {
            if (args.length === 0 && !BotsApp.isTextReply) {
                await client
                    .sendMessage(BotsApp.chatId, QR.INVALID_INPUT, MessageType.text)
                    .catch((err) => inputSanitization.handleError(err, client, BotsApp));
                return;
            }

            let message: string;
            if (!BotsApp.isTextReply) {
                message = args.join(" ");
            } else {
                message = BotsApp.replyMessage;
            }

            const qrcode: Encoder = new Encoder();

            qrcode.setEncodingHint(true);
            qrcode.setErrorCorrectionLevel(ErrorCorrectionLevel.Q);
            qrcode.write(new QRByte(message));
            qrcode.make();
            const output: string = qrcode.toDataURL().split(",")[1];

            const imagePath = "./tmp/qr.png";
            fs.writeFileSync(
                imagePath,
                output,
                { encoding: "base64" }
            );

            await client.sendMessage(
                BotsApp.chatId,
                fs.readFileSync(imagePath),
                MessageType.image,
                {
                    caption: QR.IMAGE_CAPTION,
                }).catch((err) =>
                    inputSanitization.handleError(err, client, BotsApp)
                );

            inputSanitization.deleteFiles(imagePath);
            return;

        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    }
};

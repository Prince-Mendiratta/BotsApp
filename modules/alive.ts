import Strings from "../lib/db";
import format from "string-format";
import inputSanitization from "../sidekick/input-sanitization";
import { MessageType } from "../sidekick/message-type";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
const alive = Strings.alive;

export = {
    name: "alive",
    description: alive.DESCRIPTION,
    extendedDescription: alive.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".alive" },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        try {
            client.sendMessage(
                BotsApp.chatId,
                alive.ALIVE_MSG,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

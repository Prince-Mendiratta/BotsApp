import Strings from "../lib/db";
import inputSanitization from "../sidekick/input-sanitization";
import { MessageType } from "../sidekick/message-type";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
const flip = Strings.flip;

export = {
    name: "flip",
    description: flip.DESCRIPTION,
    extendedDescription: flip.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".flip" },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        let outcomes = ["Heads", "Tails"];
        //An array that has the possible outcomes from flipping a coin, heads and tails
        let outcomesIndex = Math.round(Math.random() * outcomes.length);
        try {
            client.sendMessage(
                BotsApp.chatId,
                outcomesIndex,
                MessageType.text
            ).catch(err => inputSanitization.handleError(err, client, BotsApp));
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

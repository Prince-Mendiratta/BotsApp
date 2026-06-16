import Strings from "../lib/db";
import inputSanitization from "../sidekick/input-sanitization";
import { MessageType } from "../sidekick/message-type";
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
const random = Strings.random;

export = {
    name: "random",
    description: random.DESCRIPTION,
    extendedDescription: random.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".random" },
    async handle(client: Client, chat: proto.IWebMessageInfo, BotsApp: BotsApp, args: string[]): Promise<void> {
        if(args.length === 0) {
            client.sendMessage(
                BotsApp.chatId,
                random.NO_ARG,
                MessageType.text
            );
            return;
        } else if(args.length >= 1) {
            let outcomes = args;
            let outcomesIndex = Math.floor(Math.random() * outcomes.length);
            try {
                client.sendMessage(
                    BotsApp.chatId,
                    outcomes[outcomesIndex],
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
            } catch (err) {
                await inputSanitization.handleError(err, client, BotsApp);
            }
        }
    },
};
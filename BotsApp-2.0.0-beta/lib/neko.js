// Disabled till fix can be found.

// const { MessageType } = require("@adiwajshing/baileys");
// const inputSanitization = require("../sidekick/input-sanitization");
// const String = require("../lib/db.js");
// const got = require("got");
// const REPLY = String.neko;
// module.exports = {
//     name: "neko",
//     description: REPLY.DESCRIPTION,
//     extendedDescription: REPLY.EXTENDED_DESCRIPTION,
//     demo: {
//         isEnabled: true,
//         text: '.neko #include <iostream> \nint main() \n{\n   std::cout << "Hello BotsApp!"; \n   return 0;\n}',
//     },
//     async handle(client, chat, BotsApp, args) {
//         try {
//             if (args.length === 0 && !BotsApp.isReply) {
//                 await client.sendMessage(
//                     BotsApp.chatId,
//                     REPLY.ENTER_TEXT,
//                     MessageType.text
//                 ).catch(err => inputSanitization.handleError(err, client, BotsApp));
//                 return;
//             }
//             const processing = await client.sendMessage(
//                 BotsApp.chatId,
//                 REPLY.PROCESSING,
//                 MessageType.text
//             ).catch(err => inputSanitization.handleError(err, client, BotsApp));
//             if (!BotsApp.isReply) {
//                 var json = {
//                     content: BotsApp.body.replace(
//                         BotsApp.body[0] + BotsApp.commandName + " ",
//                         ""
//                     ),
//                 };
//             } else {
//                 var json = {
//                     content: BotsApp.replyMessage.replace(
//                         BotsApp.body[0] + BotsApp.commandName + " ",
//                         ""
//                     ),
//                 };
//             }
//             let text = await got.post("https://nekobin.com/api/documents", {
//                 json,
//             });
//             json = JSON.parse(text.body);
//             neko_url = "https://nekobin.com/" + json.result.key;
//             client.sendMessage(BotsApp.chatId, neko_url, MessageType.text).catch(err => inputSanitization.handleError(err, client, BotsApp));
//             return await client.deleteMessage(BotsApp.chatId, {
//                 id: processing.key.id,
//                 remoteJid: BotsApp.chatId,
//                 fromMe: true,
//             }).catch(err => inputSanitization.handleError(err, client, BotsApp));
//         } catch (err) {
//             if (json.result == undefined) {
//                 await inputSanitization.handleError(
//                     err,
//                     client,
//                     BotsApp,
//                     REPLY.TRY_LATER
//                 );
//             } else {
//                 await inputSanitization.handleError(err, client, BotsApp);
//             }
//             return await client.deleteMessage(BotsApp.chatId, {
//                 id: processing.key.id,
//                 remoteJid: BotsApp.chatId,
//                 fromMe: true,
//             }).catch(err => inputSanitization.handleError(err, client, BotsApp));
//         }
//     },
// };

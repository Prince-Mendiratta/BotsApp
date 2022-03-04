const chalk = require("chalk");
const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const fs = require("fs");
const ytdl = require("ytdl-core");
const Strings = require("../lib/db");
const VID = Strings.vid;

module.exports = {
	name: "vid",
	description: VID.DESCRIPTION,
	extendedDescription: VID.EXTENDED_DESCRIPTION,
	demo: { isEnabled: true, text: ".vid https://www.youtube.com/watch?v=djV11Xbc914" },
	async handle(client, chat, BotsApp, args) {
		try {
			if (args.length === 0) {
				await client.sendMessage(
					BotsApp.chatId,
					VID.ENTER_INPUT,
					MessageType.text
				).catch(err => inputSanitization.handleError(err, client, BotsApp));
				return;
			}

			var link = args[0];
			if (!ytdl.validateURL(link)) {
				var reply = await client.sendMessage(
					BotsApp.chatId,
					VID.INVALID_LINK,
					MessageType.text
				).catch(err => inputSanitization.handleError(err, client, BotsApp));

				await client.deleteMessage(BotsApp.chatId, {
					id: reply.key.id,
					remoteJid: BotsApp.chatId,
					formMe: true,
				});

				return;
			}

			var vid_name = './' + link.match('[^/]*$')[0] + '.mp4';
			var yt = ytdl(link, {filter: format => format.container === 'mp4' && ['720p', '480p', '360p', '240p', '144p'].map(() => true)});
			yt.pipe(fs.createWriteStream(vid_name));
			var reply = await client.sendMessage(
				BotsApp.chatId,
				VID.REPLY,
				MessageType.text
			).catch(err => inputSanitization.handleError(err, client, BotsApp));

			yt.on('end', async () => {
				await client.sendMessage(
					BotsApp.chatId,
					fs.readFileSync(vid_name),
					MessageType.video, {
						mimetype: Mimetype.mp4
					}
				).catch(err => inputSanitization.handleError(err, client, BotsApp));

				fs.unlink(vid_name, (err) => {
					if (err) console.log('[ERROR] : %s', chalk.redBright.bold(err));
				});
			});

			await client.deleteMessage(BotsApp.chatId, {
				id: reply.key.id,
				remoteJid: BotsApp.chatId,
				fromMe: true,
			});
		} catch (err) {
			console.log('[ERROR] : %s', chalk.redBright.bold(err));
		}
	},
};

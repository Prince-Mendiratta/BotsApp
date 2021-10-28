const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const STRINGS = require("../lib/db");
const got = require("got");

module.exports = {
    name: "github",
    description: STRINGS.github.DESCRIPTION,
    extendedDescription: STRINGS.github.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".github Prince-Mendiratta" },
    async handle(client, chat, BotsApp, args) {
        var fetching = await client.sendMessage(
            BotsApp.chatId,
            STRINGS.github.FETCHING,
            MessageType.text
        );
        try {
            let user_name = "";
            if (BotsApp.isReply) {
                user_name = BotsApp.replyMessage;
            } else {
                if (args.length == 0) {
                    client.sendMessage(
                        BotsApp.chatId,
                        STRINGS.github.NO_ARG_ERROR,
                        MessageType.text
                    );
                    return;
                }
                user_name = args[0];
            }
            let userResponse = await got(
                "https://api.github.com/users/" + user_name
            );
            let user = JSON.parse(userResponse.body);
            Object.keys(user).forEach(function (key) {
                if (user[key] === null || user[key] === "") {
                    user[key] = "N/A";
                }
            });
            let caption =
                "*👤 Name :* " +
                user.name +
                "\n*💻 Link :* " +
                user.html_url +
                "\n*🔧 Type :* " +
                user.type +
                "\n*🏢 Company :* " +
                user.company +
                "\n*🔭 Blog :* " +
                user.blog +
                "\n*📍 Location :* " +
                user.location +
                "\n*📝 Bio :* " +
                user.bio +
                "\n*❤️ Followers :* " +
                user.followers +
                "\n*👁️ Following :* " +
                user.following +
                "\n*📊 Public Repos :* " +
                user.public_repos +
                "\n*📄 Public Gists :* " +
                user.public_gists +
                "\n*🔗 Profile Created :* " +
                user.created_at +
                "\n*✏️ Profile Updated :* " +
                user.updated_at;
            if (user.public_repos > 0) {
                let reposResponse = await got(user.repos_url);
                let reposData = JSON.parse(reposResponse.body);
                repos = reposData[0].name;
                for (let i = 1; i < reposData.length && i < 5; i++) {
                    repos += " | " + reposData[i].name;
                }
                caption += "\n*🔍 Some Repos :* " + repos;
            }
            try {
                await client.sendMessage(
                    BotsApp.chatId,
                    {
                        url: user.avatar_url,
                    },
                    MessageType.image,
                    {
                        mimetype: Mimetype.png,
                        caption: caption,
                        thumbnail: null,
                    }
                );
            } catch (err) {
                client.sendMessage(BotsApp.chatId, caption, MessageType.text);
            }
            return await client.deleteMessage(BotsApp.chatId, {
                id: fetching.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true,
            });
        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                BotsApp,
                STRINGS.github.ERROR_MSG
            );
            return await client.deleteMessage(BotsApp.chatId, {
                id: fetching.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true,
            });
        }
    },
};

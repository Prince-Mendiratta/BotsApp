export
const inputSanitization = require("../sidekick/input-sanitization");
const STRINGS = require("../lib/db");
const got = require("got");
const TRANSMIT = require('../core/transmission')

module.exports = {
    name: "github",
    description: STRINGS.github.DESCRIPTION,
    extendedDescription: STRINGS.github.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".github Paddy-Pyker" },
    async handle(client, chat, BotsApp, args) {
        await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.github.FETCHING})

        try {
            let user_name = "";
            if (BotsApp.isReply) {
                user_name = BotsApp.replyMessage;
            } else {
                if (args.length == 0) {
                   return  await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: STRINGS.github.NO_ARG_ERROR})
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
                let repos = reposData[0].name;
                for (let i = 1; i < reposData.length && i < 5; i++) {
                    repos += " | " + reposData[i].name;
                }
                caption += "\n*🔍 Some Repos :* " + repos;
            }
            try {
                await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {image:{url:user.avatar_url},caption:caption,thumbnail:null})

            } catch (err) {
                await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: caption})
            }

        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                BotsApp,
                STRINGS.github.ERROR_MSG
            );

        }
    },
};

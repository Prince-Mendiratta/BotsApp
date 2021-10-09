const {
    MessageType,
    Mimetype
} = require("@adiwajshing/baileys")
const STRINGS = require("../lib/db")
const got = require("got");
const format = require('python-format-js');

module.exports = {
    name: "git",
    description: STRINGS.git.DESCRIPTION,
    extendedDescription: STRINGS.git.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        let user_name = "";
        if (BotsApp.isReply) {
            user_name = BotsApp.replyMessage;
        }
        else {
            user_name = args[0];
        }
        try {
            let userResponse = await got("https://api.github.com/users/" + user_name);
            let user = JSON.parse(userResponse.body)
            let reposResponse = await got(user.repos_url);
            let reposData = JSON.parse(reposResponse.body);
            let repos = 'None';
            if (reposData.length != 0) {
                repos = reposData[0].name;
                for (let i = 1; i < reposData.length; i++) {
                    repos += ' | ' + reposData[i].name;
                }
            }
            if (!user.company) { user.company = "N/A"; }
            if (!user.blog) { user.blog = "N/A"; }
            if (!user.location) { user.location = "N/A"; }
            if (!user.bio) { user.bio = "N/A"; }
            let img_url = user.avatar_url;
            let caption = STRINGS.git.DESIGN.format(user.name, user.html_url, user.type, user.company, user.blog, user.location, user.bio, user.followers, user.following, user.public_repos, user.public_gists, user.created_at, user.updated_at, repos)
            client.sendMessage(BotsApp.chatId, {
                url: img_url
            }, MessageType.image, {
                mimetype: Mimetype.image,
                caption: caption
            });
        }
        catch (err) {
            console.log(err);
            client.sendMessage(BotsApp.chatId, STRINGS.git.ERROR_MSG, MessageType.text);
        }
        return;
    }
}
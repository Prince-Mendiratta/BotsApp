const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const chalk = require("chalk");
const String = require("../lib/db.js");
const Carbon = require("unofficial-carbon-now");
const inputSanitization = require("../sidekick/input-sanitization");
const CARBON = String.carbon

module.exports = {
    name: "carbon",
    description: CARBON.DESCRIPTION,
    extendedDescription: CARBON.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        let themes = ["3024 night", "a11y dark", "blackboard", "base 16 (dark)", "base 16 (light)", "cobalt", "duotone", "hopscotch", "lucario", "material", "monokai", "night owl", "nord", "oceanic next", "one light", "one dark", "panda", "paraiso", "seti", "shades of purple", "solarized (dark)", "solarized (light)", "synthwave '84", "twilight", "verminal", "vscode", "yeti", "zenburn"];
        var code = ''
        
        if(args[0] == null && !BotsApp.isReply) {
            await client.sendMessage(BotsApp.chatId, CARBON.NO_INPUT, MessageType.text);
            return;
        } else if(!BotsApp.isReply && args[0][0] === '-' && args[0][1] === 't') {
            let counter = 1;
            var message = '';
            themes.forEach((theme) => {
                message += `\n${counter}. ${theme}`;
                counter += 1;
            })
            message = "```Available themes:" + message + "```";
            await client.sendMessage(BotsApp.chatId, `${message}`, MessageType.text)
            return;
        } else if (BotsApp.isReply && !BotsApp.replyMessage) {
            await client.sendMessage(BotsApp.chatId, CARBON.INVALID_REPLY, MessageType.text);
            return;
        } else if (BotsApp.isReply) {
            code = BotsApp.replyMessage;
            themeInput = themes[Math.floor(Math.random()*themes.length)];
        } else {
            try{
                var body = BotsApp.body.split("-t")
                code = body[0].replace(BotsApp.body[0] + BotsApp.commandName + " ", "");
                themeInput = body[1].substring(1);
                if(!themes.includes(themeInput)){
                    await client.sendMessage(BotsApp.chatId, CARBON.INVALID_THEME, MessageType.text);
                    return;
                }
            }catch(err){
                if(err instanceof TypeError){
                    code = BotsApp.body.replace(BotsApp.body[0] + BotsApp.commandName + " ", "");
                    themeInput = themes[Math.floor(Math.random()*themes.length)];
                }
                console.log(err);
            }
        }
        try{
            const proccessing = await client.sendMessage(BotsApp.chatId, CARBON.CARBONIZING, MessageType.text);
            const carbon = new Carbon.createCarbon().setCode(code).setPrettify(true).setTheme(themeInput);
            const output = await Carbon.generateCarbon(carbon);
            await client.sendMessage(
                BotsApp.chatId, 
                output,
                MessageType.image,
                {mimetype: Mimetype.png,
                caption: CARBON.OUTPUT.format(themeInput)}
            );
            return await client.deleteMessage(BotsApp.chatId, {
                id: proccessing.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true,
            });
        }catch(err){
            console.log(err);
        }
    }
}

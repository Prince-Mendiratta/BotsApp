export
const String = require("../lib/db");
const Carbon = require("unofficial-carbon-now");
const inputSanitization = require("../sidekick/input-sanitization");
const CARBON = String.carbon;
const TRANSMIT = require('../core/transmission')

module.exports = {
    name: "carbon",
    description: CARBON.DESCRIPTION,
    extendedDescription: CARBON.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".carbon Hi! Welcome to BotsApp.",
            '.carbon #include <iostream> \nint main() \n{\n   std::cout << "Hello BotsApp!"; \n   return 0;\n} -t yeti',
            ".carbon -t",
        ],
    },
    async handle(client, chat, BotsApp, args,fromCode = "") {
        try {
            let themes = [
                "3024 night",
                "a11y dark",
                "blackboard",
                "base 16 (dark)",
                "base 16 (light)",
                "cobalt",
                "duotone",
                "hopscotch",
                "lucario",
                "material",
                "monokai",
                "night owl",
                "nord",
                "oceanic next",
                "one light",
                "one dark",
                "panda",
                "paraiso",
                "seti",
                "shades of purple",
                "solarized (dark)",
                "solarized (light)",
                "synthwave '84",
                "twilight",
                "verminal",
                "vscode",
                "yeti",
                "zenburn",
            ];
            var code = ""
            var themeInput = ""
            if (args[0] == null && !BotsApp.isReply) {
                return  await  TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:CARBON.NO_INPUT});
            } else if (BotsApp.isReply && !BotsApp.replyMessage) {
                return  await  TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:CARBON.INVALID_REPLY});
            } else if (BotsApp.isReply) {
                code = BotsApp.replyMessage;
                themeInput = themes[Math.floor(Math.random() * themes.length)];
            } else {
                try {
                    var text = BotsApp.body.replace(
                        BotsApp.body[0] + BotsApp.commandName + " ",
                        ""
                    );
                    if (text[0] === "-" && text[1] === "t") {
                        if(text[2] == null){
                            let counter = 1;
                            var message = 'Available themes: ';
                            themes.forEach((theme) => {
                                message += `\n${counter}. ${theme}`;
                                counter += 1;
                            })

                            return  await  TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:"```" + message + "```"});

                        }
                        else{
                            return  await  TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:CARBON.NO_INPUT});

                        }
                    }
                    var body = BotsApp.body.split("-t");
                    code = body[0].replace(
                        BotsApp.body[0] + BotsApp.commandName + " ",
                        ""
                    );
                     themeInput = body[1].substring(1);
                    if (!themes.includes(themeInput)) {
                        return  await  TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:CARBON.INVALID_THEME});

                    }
                } catch (err) {
                    if (err instanceof TypeError) {
                        code = BotsApp.body.replace(
                            BotsApp.body[0] + BotsApp.commandName + " ",
                            ""
                        );
                        themeInput =
                            themes[Math.floor(Math.random() * themes.length)];
                    }
                }
            }
            try {
                if(!fromCode)
                await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:CARBON.CARBONIZING});

                const carbon = new Carbon.createCarbon()
                    .setCode(code)
                    .setPrettify(true)
                    .setTheme(themeInput);
                const output = await Carbon.generateCarbon(carbon);

               return await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{image:output,caption:fromCode?fromCode:""})

            } catch (err) {
                await inputSanitization.handleError(err, client, BotsApp);
            }
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};

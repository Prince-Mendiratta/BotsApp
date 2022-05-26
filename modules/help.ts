export
const Strings = require("../lib/db")
const inputSanitization = require("../sidekick/input-sanitization");
const config = require("../config");
const TRANSMIT = require('../core/transmission')
const HELP = Strings.help;
require('python-format-js');


module.exports = {
    name: "help",
    description: HELP.DESCRIPTION,
    extendedDescription: HELP.EXTENDED_DESCRIPTION,
    demo: {isEnabled: false},
    async handle(client, chat, BotsApp, args, commandHandler) {
        var helpMessage = ""
        try {
            var prefixRegex = new RegExp(config.PREFIX, "g");
            // @ts-ignore
            var prefixes = /\/\^\[(.*)+]\/g/g.exec(prefixRegex)[1]

            if(!args[0]){
                 helpMessage = HELP.HEAD;
                commandHandler.forEach(element => {
                    helpMessage += HELP.TEMPLATE.format(prefixes[0] + element.name, element.description);
                });
                await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:helpMessage})
                return;
            }
            helpMessage = HELP.COMMAND_INTERFACE;
            var command = commandHandler.get(args[0].toLowerCase())
            if(command){
                var triggers = "\n"
                prefixes.split("").forEach(prefix => {
                    triggers += prefix + command.name + " | "
                })
                var triggerss = ""
                for(let i = 0;i<triggers.length-3;i++){
                    triggerss += triggers[i]
                }
                triggerss += '\n'


                if(command.demo.isEnabled) {
                    var buttons = [];
                    helpMessage += HELP.COMMAND_INTERFACE_TEMPLATE.format(triggerss, command.extendedDescription) + HELP.FOOTER;
                    if(command.demo.text instanceof Array){
                        for (var i in command.demo.text){
                            var button = {
                                buttonId: 'id' + i,
                                buttonText: {displayText: command.demo.text[i]},
                                type: 1
                            }
                            buttons.push(button);
                        }
                    }else{
                        buttons.push({buttonId: 'id1', buttonText: {displayText: command.demo.text}, type: 1});
                    }
                    const buttonMessage = {
                        text: helpMessage,
                        footer:"\n *tap the button below to try it out*",
                        buttons: buttons,
                        headerType: 1
                    }
                    return await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,buttonMessage)

                }

                helpMessage += HELP.COMMAND_INTERFACE_TEMPLATE.format(triggerss, command.extendedDescription);
                return await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:helpMessage})

            }
            await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:HELP.COMMAND_INTERFACE + "```Invalid Command. Check the correct name from```  *.help*  ```command list.```"})
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};
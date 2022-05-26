export
const String = require("../lib/db");
const Carbon = require("./carbon");
const inputSanitization = require("../sidekick/input-sanitization");
const CODE = String.code;
const TRANSMIT = require('../core/transmission')
const request = require('request')
const config = require("../config");

module.exports = {
    name: "code",
    description: CODE.DESCRIPTION,
    extendedDescription: CODE.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".code -a",
            '.code -a cpp  \n\n#include <iostream> \nint main() \n{\n   std::cout << "Hello BotsApp!"; \n   return 0;\n}',
            '.code -a python3 \n\nprint("I can now speak in snake tongues")'
        ],
    },
    async handle(client, chat, BotsApp, args) {
        try {

            let langs = new Map([
                ['bash',4],
                ['java',4],
                ['c',5],
                ['cpp',5],
                ['cpp14',4],
                ['cpp17',1],
                ['php',4],
                ['perl',4],
                ['python2',3],
                ['python3',4],
                ['ruby',4],
                ['go',4],
                ['scala',4],
                ['sql',3],
                ['csharp',4],
                ['objc',4],
                ['swift',4],
                ['lua',3],
                ['r',4],
                ['verilog',3],
                ['dart',4],
                ['nodejs',4],
                ['coffeescript',4],
                ['fsharp',1],
                ['kotlin',3]
            ])

            var languages = new Map([...langs.entries()].sort())


            var script
            var language
            var langversion

            if (args[0] == null)
                return  await  TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:CODE.NO_INPUT})

            else if (args[0][0] === '-' && args[0][1] === 'a'){

                if(args[1] === undefined) {
                    let counter = 1;
                    var message = 'Available languages: ';

                    languages.forEach((ver_code, lang) => {
                        message += `\n${counter}. ${lang}`;
                        counter += 1;
                    })
                    return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: "```" + message + "```"});
                }
                else {
                    //parse success, extract contents
                    language = args[1]
                    if(!languages.has(language)) {
                        return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: CODE.LANG_NOT_FOUND});
                    }
                    langversion = languages.get(language)

                    const criteria = "-a\\s+" +language+ "\\s+\\n*"
                    const re = new RegExp(criteria)

                    script = BotsApp.body.trim().split(re).slice(1)[0]
                    console.log(script)


                    var program = {
                        script : script,
                        language: language,
                        versionIndex: langversion,
                        clientId: config.CODE_CLIENT_ID,
                        clientSecret:config.CODE_CLIENT_SECRET,
                        stdin:2
                    };

                    await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: CODE.PROCESSING});

                    await request({
                            url: 'https://api.jdoodle.com/v1/execute',
                            method: "POST",
                            json: program
                        },
                       async function (error, response, body) {

                           console.log('error:', error);
                           console.log('statusCode:', response && response.statusCode);
                           console.log('body:', body);

                        if (error)
                            return await inputSanitization.handleError(error, client, BotsApp)


                        if (response){
                            if (response.statusCode == 429)  return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: CODE.DAILY_LIMIT_REACHED});

                            if(response.statusCode == 200){
                               var ExecutionResults = "*Output*: " + body.output + "\n\n" + "```Memory: " + body.memory + "\n" + "CpuTime: " + body.cpuTime + "```"
                                 return await Carbon.handle(client,BotsApp.chat,BotsApp,script,ExecutionResults)


                            }

                        }

                        });
                }

            }

            else{
                //parsing failed
                return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: CODE.PARSE_FAILED})
            }
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }

    }
}



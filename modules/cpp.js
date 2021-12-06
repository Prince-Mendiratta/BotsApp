const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const Strings = require("../lib/db");
const format = require("python-format-js");
const inputSanitization = require("../sidekick/input-sanitization");
const CPP = Strings.cpp;
const fs = require("fs");
const { promisify } = require('util');
const exec = promisify(require("child_process").exec);
const config = require('../config')

module.exports = {
    name: "cpp",
    description: CPP.DESCRIPTION,
    extendedDescription: CPP.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ['.cpp printf("Hello from BotsApp!");', '.cpp #include <bits/stdc++.h>\n#include <bits/stdc++.h>\n#include <queue>\nusing namespace std;\n\nint main() {\n  cout << "BotsApp is the best!" << endl;\n}'] },
    async handle(client, chat, BotsApp, args) {
        try {
            if(args[0] == null){
                await client.sendMessage(
                    BotsApp.chatId,
                    CPP.NO_INPUT,
                    MessageType.text
                ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                return;
            }
            var processing = await client.sendMessage(
                BotsApp.chatId,
                CPP.PROCESSING,
                MessageType.text
            )
            var input = BotsApp.body.replace(
                BotsApp.body[0] + BotsApp.commandName + " ",
                ""
            );
            var code = ""
            if(!(/main\(/g.test(input))){
                code = CPP.BOILERPLATE.replace("{code}", input);
            }else{
                code = input;
            }
            fs.writeFileSync('./tmp/cpp-botsapp.cpp', code);
            var out = {}
            var compile = "g++ ./tmp/cpp-botsapp.cpp -o ./tmp/cppBotsApp.out"
            var execute = "env -i ./tmp/cppBotsApp.out"
            try{
                await exec(compile)
                var eval = await exec(execute)
                out.stderr = "N/A"
                out.stdout = eval.stdout
            }catch(err){
                out.stderr = err.stderr
                out.stdout = "N/A"
            }
            out.code = code
            await client.sendMessage(
                BotsApp.chatId,
                CPP.OUTPUT_TEMPLATE.format(out),
                MessageType.text
            )
            await client.deleteMessage(BotsApp.chatId, {
                id: processing.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true,
            })
            inputSanitization.deleteFiles(
                "./tmp/cppBotsApp.out",
                "./tmp/cpp-botsapp.cpp"
            );
        } catch (err) {
            console.log(err);
            await inputSanitization.handleError(err, client, BotsApp);
        }
    }
};

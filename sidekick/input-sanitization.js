const { MessageType } = require("@adiwajshing/baileys");

exports.getCleanedContact = async (args,client,BotsApp) => {
    var jidNumber = '';
    var countryCode = '';
    if (isNaN(args[0]) || args[0][0] === "+") {
        if (args[0][0] === "@" || args[0][0] === "+") {
            jidNumber = args[0].substring(1, args[0].length + 1);
            countryCode = BotsApp.owner.substring(-28,-26);
            if (jidNumber.length < 10 || jidNumber.length > 13) {
                client.sendMessage(
                    BotsApp.chatId,
                    "*Enter valid contact number.* Approved Syntax:\n```1. XXXXXXXXXX``` \n```2. Tag the person``` \n```3. +(YYY)XXXXXXXXXX.``` \n_(YY- Country Code, without zeros)_",
                    MessageType.text
                );
                return;
            } 
            else if (jidNumber.length === 10) {
                jidNumber = BotsApp.owner.substring(-28,-26) + jidNumber;
            }
        }
        else {
            client.sendMessage(BotsApp.chatId,"*Enter valid contact number.* Approved Syntax:\n```1. XXXXXXXXXX``` \n```2. Tag the person``` \n```3. +(YYY)XXXXXXXXXX.``` \n_(YY- Country Code, without zeros)_",MessageType.text);
            return;
        }
    } else {
        jidNumber = args[0];
    }
    if (jidNumber.length < 10 || jidNumber.length > 13) {
        client.sendMessage(
            BotsApp.chatId,"*Enter valid contact number.* Approved Syntax:\n```1. XXXXXXXXXX``` \n```2. Tag the person``` \n```3. +(YYY)XXXXXXXXXX.``` \n_(YY- Country Code, without zeros)_",MessageType.text);
        return;
    } else if (jidNumber.length === 10) {
        jidNumber = BotsApp.owner.substring(-28,-26) + jidNumber;
    }
    
    return jidNumber;
}
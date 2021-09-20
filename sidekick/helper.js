const { MessageType } = require("@adiwajshing/baileys")
exports.helper = async (args,client,BotsApp) => {

    if (isNaN(args[0]) || args[0][0] === "+") {
        if (args[0][0] === "@" || args[0][0] === "+") {
            jidNumber = args[0].slice(1, args[0].length + 1);
            console.log("-------------------/-----------------");
            console.log("Jidnumber: " + jidNumber)
            console.log("-------------------/-----------------");
            if (jidNumber.length < 10 || jidNumber.length > 13) {
                client.sendMessage(
                    BotsApp.from,
                    "*Enter valid contact number*",
                    MessageType.text
                );
                return;
            } 
            else if (jidNumber.length === 10) {
                jidNumber = BotsApp.from.slice(-25) + jidNumber;
            }
        }
        else {
            client.sendMessage(BotsApp.from,"*Enter valid contact number*",MessageType.text);
            return;
        }
    } else {
        jidNumber = args[0];
    }
    if (jidNumber.length < 10 || jidNumber.length > 13) {
        client.sendMessage(
            BotsApp.from,"*Enter valid contact number*",MessageType.text);
        return;
    } else if (jidNumber.length === 10) {
        jidNumber = BotsApp.from.slice(-25) + jidNumber;
    }
  
    return jidNumber;
}
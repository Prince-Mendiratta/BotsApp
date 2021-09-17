const { MessageType } = require("@adiwajshing/baileys")
const chalk = require('chalk');
module.exports = {
    name: "promote",
    description: "Promote",
    extendedDescription: "Promote member to admin",
    async handle(client, chat , BotsApp, args){
        if(!BotsApp.isGroup){
            client.sendMessage(BotsApp.from, "*This is not a group*", MessageType.text);
        }
        else{
            if(!BotsApp.isBotGroupAdmin){
                client.sendMessage(BotsApp.from,"*I am not group admin*", MessageType.text);
            }

            else{
                try{
                    if(chat.messages.all()[0].message.extendedTextMessage.text.split("@")[1]== null){
                    
                        var adm = false;
                        let parName = " "; 
                        for (const key in BotsApp.groupMembers) {
                            if(chat.messages.all()[0].message.extendedTextMessage.contextInfo.participant.split('@')[0] == BotsApp.groupMembers[key].id.split('@')[0]){
                                parName = BotsApp.groupMembers[key].name;
                                if(BotsApp.groupMembers[key].isAdmin){
                                    adm = true;
                                    
                                }
                            }
                        }
                        console.log("-------------/-------------/-------------/-------------\n");
                        console.log(chat.messages.all()[0].message.extendedTextMessage.contextInfo.participant.split('@')[0]);
                        console.log(parName);
                        console.log("-------------/-------------/-------------/-------------\n");
                    
                        if(!adm == true){
                            const arr =[];
                            arr.push(chat.messages.all()[0].message.extendedTextMessage.contextInfo.participant)
                            client.groupMakeAdmin (BotsApp.from,arr)
                            client.sendMessage(BotsApp.from, "*" + parName + " promoted to admin*", MessageType.text);
                        } 
                        else{
                            client.sendMessage(BotsApp.from, "*" + parName + " is already an admin*", MessageType.text);
                        }
                    }
                
                    else{
                    
                        var adm = false;
                        let parName = " "; 
                        for (const key in BotsApp.groupMembers) {
                            if(chat.messages.all()[0].message.extendedTextMessage.text.split("@")[1] == BotsApp.groupMembers[key].id.split('@')[0]){
                                parName = BotsApp.groupMembers[key].name;
                                if(BotsApp.groupMembers[key].isAdmin){
                                    adm = true;
                                    
                                }
                            }
                        }
                        console.log("-------------/-------------/-------------/-------------\n");
                        console.log(chat.messages.all()[0].message.extendedTextMessage.text.split("@")[1]);
                        console.log(parName);
                        console.log("-------------/-------------/-------------/-------------\n");
                    
                        if(!adm == true){
                            const arr =[];
                            arr.push(chat.messages.all()[0].message.extendedTextMessage.text.split("@")[1] + "@s.whatsapp.net")
                            await client.groupMakeAdmin (BotsApp.from,arr)
                            client.sendMessage(BotsApp.from, "*" + parName + " promoted to admin*", MessageType.text);
                        } 
                        else{
                            client.sendMessage(BotsApp.from, "*" + parName + " is already an admin*", MessageType.text);
                        }
                    }
                }
                catch(err){
                        if(chat.messages.all()[0].message.extendedTextMessage || err instanceof TypeError){
                            console.log(
                                chalk.redBright.bold("Please reply to the person for promotion"));
                            client.sendMessage(BotsApp.from, "*Please reply to someone for promotion*", MessageType.text);
                        }
                        else{
                            console.log(err);
                        }
                
                    }

            }
                
        }
    }
}
    
           



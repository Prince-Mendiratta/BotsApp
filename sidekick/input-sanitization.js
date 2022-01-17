const { MessageType } = require("@adiwajshing/baileys");
const config = require('../config')
const fs = require("fs");
const chalk = require("chalk");
const { JSDOM } = require("jsdom");
const { window } = new JSDOM();
const ERROR_TEMPLATE = require("../lib/db").general.ERROR_TEMPLATE
require("python-format-js");

exports.getCleanedContact = async (args,client,BotsApp) => {
    var jidNumber = '';
    var countryCode = config.COUNTRY_CODE; 
    if (isNaN(args[0]) || args[0][0] === "+") {
        if (args[0][0] === "@" || args[0][0] === "+") {
            jidNumber = args[0].substring(1, args[0].length + 1);
           
            
        }
        else {
            client.sendMessage(BotsApp.chatId,"*Enter valid contact number.* Approved Syntax:\n```1. XXXXXXXXXX``` \n```2. Tag the person``` \n```3. +(YYY)XXXXXXXXXX.``` \n_(YY- Country Code, without zeros)_",MessageType.text);
            return undefined;
        }
    } else {
        jidNumber = args[0];       
    }

    if (jidNumber.length < 8 || jidNumber.length > 13) {
        client.sendMessage(
            BotsApp.chatId,
            "*Enter valid contact number.* Approved Syntax:\n```1. XXXXXXXXXX``` \n```2. Tag the person``` \n```3. +(YYY)XXXXXXXXXX.``` \n_(YY- Country Code, without zeros)_",
            MessageType.text
        );
        return undefined;
    } 
    else if (jidNumber.length === 10) { 
        jidNumber = countryCode + jidNumber;
    }
    var isOnWhatsApp = await client.isOnWhatsApp(jidNumber);
    if(isOnWhatsApp === undefined){
        throw "NumberInvalid"; 
    }
    
    // isOnWhatsApp is not working
    return jidNumber;
}

exports.deleteFiles = async (...locations) => {
    for (location of locations) {
        fs.unlink(location, (err) => {
            if (err) console.log(err);
            else {
                // console.log("\nDeleted file at: " + location);
            }
        });
    }
};

exports.performanceTime = async (startTime) => {
    var endTime = window.performance.now();
    // console.log(
    //     `-----------\nExecution time: ${
    //         (endTime - startTime) / 1000
    //     } seconds\n----------`
    // );
}

exports.isMember = async (chatId, groupMembers) => {
    var isMember = false;
    for (const index in groupMembers) {
        if (chatId == groupMembers[index].id.split("@")[0]) {
            isMember = true;
        }
    }
    return isMember;
}

exports.adminCommands = [
    "add",
    "demote",
    "invite",
    "mute",
    "promote",
    "remove",
    "unmute",
    "welcome",
    "disappear",
    "goodbye",
    "setdp",
    "tagall",
    "abl",
    "rbl"
];

exports.sudoCommands = ["block", "unblock", "setdp", "sudo"];

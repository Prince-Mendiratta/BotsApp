const data = {
    general: {
        NUMBER_SYNTAX_ERROR:
            "Enter a valid contact number. Valid syntax,\n    1. XXXXXXXXXX\n    2. Tag the person\n    3. +YYXXXXXXXXXX (YY- Country Code, without zeros)",
        MESSAGE_NOT_TAGGED: "Tag a message or enter a number",
        NOT_A_GROUP: "*This is not a group.*",
        BOT_NOT_ADMIN: "*I am not group admin.*",
    },
    alive: {
        DESCRIPTION: "Check if bot is online.",
        EXTENDED_DESCRIPTION: "```This module can be used to check if the bot is currently online or not.```\n\n*Example usage,*\n```.alive```",
        ALIVE_MSG: "I'm alive, {}."
    },
    add: {
        DESCRIPTION: "Module to add a person to a group.",
        EXTENDED_DESCRIPTION: "Use this module to add people to a group. You can enter the person's mobile number. *Valid Syntaxes -*\n1. XXXXXXXXXX\n2. YYXXXXXXXXXX ()\n\nFor example -\n```.add 9861212121```",
        NUMBER_SYNTAX_ERROR: "*Valid Syntaxes -*\n1. XXXXXXXXXX\n2. YYXXXXXXXXXX \n\nFor example -\n```.add 9861212121```",
        NO_ARG_ERROR: "*Enter the Number you want to add like '.add <NUMBER>'.*",
        NO_24HR_BAN: "*The number you're trying to add cannot be added for around 24 hours.*",
        ALREADY_MEMBER: "*The number you're trying to add is already present in the group.*",
        NOT_ON_WHATSAPP: "*The number you're trying to add is not available on WhatsApp. Please check the number again.*",
        SUCCESS: " added successfully!",
    },
    remove: {
        DESCRIPTION: "Module to remove a person from a group.",
        EXTENDED_DESCRIPTION: "Use this module to remove people from the group by tagging them '.remove @<person-to-remove>' or replying to them '.remove'.",
        INPUT_ERROR: "*Reply to the person you want to remove or tag them.*",

    },
    invite: {
        DESCRIPTION: "Module to create group invite link.",
        EXTENDED_DESCRIPTION: "Use this module to send group invite link in group or DM it to someone.",
        LINK_SENT: "```Invite link sent in DM, please check.```",
    },
    tagall: {
        DESCRIPTION: "Module to tag evryone in a group.",
        EXTENDED_DESCRIPTION: "Use this module to tag everyone in the group by either replying to a message or simply using '.tagall' command.",
        TAG_MESSAGE: "*Everyone!*",
    },
    block: {
        DESCRIPTION: "block contact",
        EXTENDED_DESCRIPTION: "Add number to the blocklist.",
        NUMBER_SYNTAX_ERROR:
            "Enter a valid contact number. Valid syntax,\n    1. XXXXXXXXXX\n    2. Tag the person\n    3. +YYXXXXXXXXXX (YY- Country Code, without zeros)",
        MESSAGE_NOT_TAGGED: "Tag a message or enter a number",
    },
    unblock: {
        DESCRIPTION: "Unblock contact",
        EXTENDED_DESCRIPTION: "Remove number from the blocklist.",
        NUMBER_SYNTAX_ERROR:
            "Enter a valid contact number. Valid syntax,\n    1. XXXXXXXXXX\n    2. Tag the person\n    3. +YYXXXXXXXXXX (YY- Country Code, without zeros)",
        MESSAGE_NOT_TAGGED: "Tag a message or enter a number",
    },
    help: {
        DESCRIPTION: "Get the command list and info on modules.",
        EXTENDED_DESCRIPTION: "This module is used to get info on other modules and their triggers.",
        HEAD: "🌀 *BotsApp Menu* 🌀\n```Use .help command for detailed info on a module.```",
        TEMPLATE: "\n\n🤖 *Command* - ```{}```\n💡 *Info* - ```{}```",
        COMMAND_INTERFACE: "🌀 *BotsApp Command Interface* 🌀\n\n",
        COMMAND_INTERFACE_TEMPLATE: "💠 *Triggers -* ```{}```\n📚 *Info -* {}"
    }
};

module.exports = data;
